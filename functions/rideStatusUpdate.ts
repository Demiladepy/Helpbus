import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const updateRideStatus = functions.https.onCall(async (data: any, context: any) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { rideId, newStatus } = data;
  const validStatuses = ['assigned', 'arriving', 'in_progress', 'completed', 'cancelled'];

  if (!validStatuses.includes(newStatus)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid status');
  }

  try {
    const rideRef = admin.firestore().collection('rides').doc(rideId);
    const rideDoc = await rideRef.get();

    if (!rideDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Ride not found');
    }

    const ride = rideDoc.data();

    // Check permissions: only passenger or assigned driver can update
    if (context.auth.uid !== ride?.userId && context.auth.uid !== ride?.driverId) {
      throw new functions.https.HttpsError('permission-denied', 'Not authorized to update this ride');
    }

    await rideRef.update({
      status: newStatus,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // If completed, save ride history for both parties
    if (newStatus === 'completed') {
      console.log('updateRideStatus: Ride completed, saving history for rideId:', rideId);
      const rideData = ride;
      if (rideData) {
        const historyData: any = {
          rideId,
          pickup: rideData.pickup,
          dropoff: rideData.dropoff,
          fare: rideData.fare || 0,
          driver: null, // Will populate if driver exists
          createdAt: rideData.createdAt,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        // Save for customer
        console.log('updateRideStatus: Saving history for customer userId:', rideData.userId);
        const customerHistoryRef = admin.firestore().collection('rideHistory').doc();
        await customerHistoryRef.set({
          userId: rideData.userId,
          ...historyData,
        });
        console.log('updateRideStatus: Saved customer history successfully');

        // Save for driver if exists
        if (rideData.driverId) {
          console.log('updateRideStatus: Saving history for driver driverId:', rideData.driverId);
          const driverDoc = await admin.firestore().collection('drivers').doc(rideData.driverId).get();
          if (driverDoc.exists) {
            const driverData = driverDoc.data();
            if (driverData?.userId) {
              historyData.driver = {
                id: driverData.id || rideData.driverId,
                name: driverData.name,
                photo: driverData.photo,
                rating: driverData.rating,
                vehicle: driverData.vehicle,
                location: driverData.location,
                eta: 0,
                availability: driverData.availability,
              };
              const driverHistoryRef = admin.firestore().collection('rideHistory').doc();
              await driverHistoryRef.set({
                userId: driverData.userId,
                ...historyData,
              });
              console.log('updateRideStatus: Saved driver history successfully');
            } else {
              console.log('updateRideStatus: Driver exists but no userId');
            }
          } else {
            console.log('updateRideStatus: Driver document not found');
          }
        } else {
          console.log('updateRideStatus: No driverId, skipping driver history');
        }
      } else {
        console.log('updateRideStatus: No rideData found');
      }
    }

    // Send notifications (implement separately)

    return { success: true, status: newStatus };
  } catch (error) {
    console.error('Error updating ride status:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update ride status');
  }
});

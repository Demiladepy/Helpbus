import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Driver } from '../src/types';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getAvailableDrivers(): Promise<Driver[]> {
  const q = query(collection(db, 'drivers'), where('availability', '==', true));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Driver));
}

async function testDriverSearch() {
  try {
    console.log('Querying for available drivers using getAvailableDrivers function logic...');
    const drivers = await getAvailableDrivers();
    console.log('Available drivers:', drivers);

    const hasLocalDriver = drivers.some(driver => driver.id === 'localDriver' || driver.name === 'Local Driver');
    console.log('Is localDriver included in results?', hasLocalDriver);

    if (hasLocalDriver) {
      console.log('Verification successful: localDriver is available.');
    } else {
      console.log('Verification failed: localDriver not found in available drivers.');
    }
  } catch (error) {
    console.error('Error during test:', error);
  }
}

testDriverSearch();
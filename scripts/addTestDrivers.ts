import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, GeoPoint, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleDrivers = [
  {
    userId: 'driver1',
    email: 'john.adebayo@example.com',
    name: 'John Adebayo',
    photo: 'https://example.com/driver1.jpg',
    rating: 4.8,
    vehicle: {
      make: 'Toyota',
      model: 'Camry',
      color: 'Blue',
      plate: 'LAG001',
      accessibilityFeatures: ['wheelchair support'],
    },
    location: {
      geopoint: new GeoPoint(6.5244, 3.3792),
      address: 'Lagos Island, Lagos, Nigeria',
    },
    availability: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    userId: 'driver2',
    email: 'mary.johnson@example.com',
    name: 'Mary Johnson',
    photo: 'https://example.com/driver2.jpg',
    rating: 4.6,
    vehicle: {
      make: 'Honda',
      model: 'Civic',
      color: 'White',
      plate: 'LAG002',
      accessibilityFeatures: ['assistance'],
    },
    location: {
      geopoint: new GeoPoint(6.5354, 3.3892),
      address: 'Victoria Island, Lagos, Nigeria',
    },
    availability: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    userId: 'driver3',
    email: 'ahmed.hassan@example.com',
    name: 'Ahmed Hassan',
    photo: 'https://example.com/driver3.jpg',
    rating: 4.7,
    vehicle: {
      make: 'Nissan',
      model: 'Altima',
      color: 'Black',
      plate: 'LAG003',
      accessibilityFeatures: ['wheelchair support', 'assistance'],
    },
    location: {
      geopoint: new GeoPoint(6.5144, 3.3692),
      address: 'Ikoyi, Lagos, Nigeria',
    },
    availability: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    userId: 'driver4',
    email: 'grace.okafor@example.com',
    name: 'Grace Okafor',
    photo: 'https://example.com/driver4.jpg',
    rating: 4.9,
    vehicle: {
      make: 'Ford',
      model: 'Focus',
      color: 'Silver',
      plate: 'LAG004',
      accessibilityFeatures: [],
    },
    location: {
      geopoint: new GeoPoint(6.5444, 3.3992),
      address: 'Surulere, Lagos, Nigeria',
    },
    availability: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    userId: 'driver5',
    email: 'david.okon@example.com',
    name: 'David Okon',
    photo: 'https://example.com/driver5.jpg',
    rating: 4.5,
    vehicle: {
      make: 'Chevrolet',
      model: 'Malibu',
      color: 'Red',
      plate: 'LAG005',
      accessibilityFeatures: ['wheelchair support'],
    },
    location: {
      geopoint: new GeoPoint(6.5044, 3.3592),
      address: 'Yaba, Lagos, Nigeria',
    },
    availability: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    userId: 'driver6',
    email: 'sarah.ibrahim@example.com',
    name: 'Sarah Ibrahim',
    photo: 'https://example.com/driver6.jpg',
    rating: 4.4,
    vehicle: {
      make: 'Hyundai',
      model: 'Elantra',
      color: 'Blue',
      plate: 'LAG006',
      accessibilityFeatures: ['assistance'],
    },
    location: {
      geopoint: new GeoPoint(6.5544, 3.4092),
      address: 'Ajah, Lagos, Nigeria',
    },
    availability: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    userId: 'driver7',
    email: 'emmanuel.nwosu@example.com',
    name: 'Emmanuel Nwosu',
    photo: 'https://example.com/driver7.jpg',
    rating: 4.8,
    vehicle: {
      make: 'Kia',
      model: 'Optima',
      color: 'White',
      plate: 'LAG007',
      accessibilityFeatures: ['wheelchair support', 'assistance'],
    },
    location: {
      geopoint: new GeoPoint(6.4944, 3.3492),
      address: 'Oshodi, Lagos, Nigeria',
    },
    availability: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    userId: 'driver8',
    email: 'fatima.bello@example.com',
    name: 'Fatima Bello',
    photo: 'https://example.com/driver8.jpg',
    rating: 4.7,
    vehicle: {
      make: 'Mazda',
      model: 'Mazda3',
      color: 'Black',
      plate: 'LAG008',
      accessibilityFeatures: [],
    },
    location: {
      geopoint: new GeoPoint(6.5644, 3.4192),
      address: 'Lekki, Lagos, Nigeria',
    },
    availability: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    userId: 'driver9',
    email: 'peter.eze@example.com',
    name: 'Peter Eze',
    photo: 'https://example.com/driver9.jpg',
    rating: 4.6,
    vehicle: {
      make: 'Volkswagen',
      model: 'Jetta',
      color: 'Gray',
      plate: 'LAG009',
      accessibilityFeatures: ['wheelchair support'],
    },
    location: {
      geopoint: new GeoPoint(6.4844, 3.3392),
      address: 'Ikeja, Lagos, Nigeria',
    },
    availability: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    userId: 'driver10',
    email: 'zara.ahmed@example.com',
    name: 'Zara Ahmed',
    photo: 'https://example.com/driver10.jpg',
    rating: 4.9,
    vehicle: {
      make: 'Subaru',
      model: 'Impreza',
      color: 'Green',
      plate: 'LAG010',
      accessibilityFeatures: ['assistance'],
    },
    location: {
      geopoint: new GeoPoint(6.5744, 3.4292),
      address: 'Festac, Lagos, Nigeria',
    },
    availability: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

async function addTestDrivers() {
  for (const driver of sampleDrivers) {
    try {
      // Add to users collection
      const userDoc = {
        id: driver.userId,
        email: driver.email,
        name: driver.name,
        photo: driver.photo,
        role: 'driver',
        createdAt: driver.createdAt,
        updatedAt: driver.updatedAt,
      };
      const userRef = doc(db, 'users', driver.userId);
      await setDoc(userRef, userDoc);
      console.log('Added user with ID: ', driver.userId);

      // Add to drivers collection
      const { email, ...driverDoc } = driver; // Remove email from driver doc
      const driverRef = doc(db, 'drivers', driver.userId);
      await setDoc(driverRef, driverDoc);
      console.log('Added driver with ID: ', driver.userId);
    } catch (e) {
      console.error('Error adding driver/user: ', e);
    }
  }
}

addTestDrivers();
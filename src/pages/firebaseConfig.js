import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA9H8Y_2vrvdT-3dOib0rGyk8Hxku1xV-U",
  authDomain: "immopulsebe.firebaseapp.com",
  projectId: "immopulsebe",
  storageBucket: "immopulsebe.appspot.com",  // Correction ici
  messagingSenderId: "698727156558",
  appId: "1:698727156558:web:9d0c598202bc91a7292c1f",
  measurementId: "G-WNP93RTS18"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAMkvjx7_QnjobX_GfnCdf6wa1n0JFaD8Y",
  authDomain: "simpliza-33e9a.firebaseapp.com",
  projectId: "simpliza-33e9a",
  storageBucket: "simpliza-33e9a.firebasestorage.app",
  messagingSenderId: "564167923878",
  appId: "1:564167923878:web:49886b1b97d5cb89e5fc67"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
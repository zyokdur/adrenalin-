import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyBL9tL3DVkDkltivxGIV14dW_IlR5_4C08",
  authDomain: "adrenalin-91d68.firebaseapp.com",
  projectId: "adrenalin-91d68",
  storageBucket: "adrenalin-91d68.firebasestorage.app",
  messagingSenderId: "684465629302",
  appId: "1:684465629302:web:d7c63c752dc6e6a7de1757",
  measurementId: "G-05YF4QKM7L"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Firestore veritabanını al
export const db = getFirestore(app);

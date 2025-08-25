import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { onAuthStateChanged } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDEpvitUn1km64oHxhVYXOx-GF7Uwk_0lY",
  authDomain: "dashboard-file.firebaseapp.com",
  projectId: "dashboard-file",
  storageBucket: "dashboard-file.firebasestorage.app",
  messagingSenderId: "544689961235",
  appId: "1:544689961235:web:9973485ef83d05dc17c2e6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore(app)
export const storage = getStorage(app);
export default app
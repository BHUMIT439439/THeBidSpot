// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore,serverTimestamp} from 'firebase/firestore'
import { getStorage } from "firebase/storage"
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';
import * as firebase from "firebase/app";


// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBcuPRm0fMeyYNdqGbOkBHzsguyF32_Ja8",
  authDomain: "onlineauctionapp-cce34.firebaseapp.com",
  projectId: "onlineauctionapp-cce34",
  storageBucket: "onlineauctionapp-cce34.appspot.com",
  messagingSenderId: "961046296478",
  appId: "1:961046296478:web:e25551ca6eb672f8ecc88f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore();

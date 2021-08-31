import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCIZDm-qAaxxCX9mCf4sWyJyO6TpoFiOps",
    authDomain: "sona-lancer.firebaseapp.com",
    projectId: "sona-lancer",
    storageBucket: "sona-lancer.appspot.com",
    messagingSenderId: "834511063980",
    appId: "1:834511063980:web:6288eeb8255fa34d2c8809",
    measurementId: "G-T7010MFD62"
  };

  if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
  }

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
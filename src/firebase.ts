import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// import { getFunctions } from 'firebase/functions';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBfRxnRvMDyMwqxScNskAAjeNyiJQYWees",
  authDomain: "dropbox-clone-2de2b.firebaseapp.com",
  projectId: "dropbox-clone-2de2b",
  storageBucket: "dropbox-clone-2de2b.appspot.com",
  messagingSenderId: "296332438580",
  appId: "1:296332438580:web:4be181cdf8381454fbee61",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
// const auth = getAuth(app);
// const functions = getFunctions(app);
const storage = getStorage(app);

export { db, storage };

import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBIW-W0cr9Y9pdZCeJB4mKXBO1wbCLwsgc",
  authDomain: "filefolio-dev-bb8af.firebaseapp.com",
  projectId: "filefolio-dev-bb8af",
  storageBucket: "filefolio-dev-bb8af.appspot.com",
  messagingSenderId: "743033547653",
  appId: "1:743033547653:web:db1df3a92d74bdac97b2ec",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };

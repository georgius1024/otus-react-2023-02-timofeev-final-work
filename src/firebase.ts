import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref as refFunc, uploadBytes as uploadBytesFunc, getDownloadURL as getDownloadURLFunc } from "firebase/storage";

const {
  VITE_APY_KEY,
  VITE_API_DOMAIN,
  VITE_PROJECT_ID,
  VITE_STORAGE_BUCKET,
  VITE_MESSAGE_SENDER_ID,
  VITE_APP_ID,
} = import.meta.env || process.env;


const firebaseConfig = {
  apiKey: VITE_APY_KEY,
  authDomain: VITE_API_DOMAIN,
  projectId: VITE_PROJECT_ID,
  storageBucket: VITE_STORAGE_BUCKET,
  messagingSenderId: VITE_MESSAGE_SENDER_ID,
  appId: VITE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage();
export const storageRef = (name: string) => refFunc(storage, name);
export const uploadBytes = uploadBytesFunc;
export const getDownloadURL = getDownloadURLFunc;

export default app;

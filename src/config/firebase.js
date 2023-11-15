import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDmfnSDXsDo0yZpSXmofTg8o-qUpL76_iQ",
  authDomain: "docs-app-mi.firebaseapp.com",
  projectId: "docs-app-mi",
  storageBucket: "docs-app-mi.appspot.com",
  messagingSenderId: "281931020298",
  appId: "1:281931020298:web:ecf1aea408234668cb07f3",
  measurementId: "G-RBDTDTZXN0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
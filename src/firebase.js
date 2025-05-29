// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADYEHvVJizbciNPRNwjGmcx09BTILCsbY",
  authDomain: "izzytechteam.firebaseapp.com",
  databaseURL: "https://izzytechteam-default-rtdb.firebaseio.com",
  projectId: "izzytechteam",
  storageBucket: "izzytechteam.appspot.com",
  messagingSenderId: "973058151155",
  appId: "1:973058151155:web:b34b6079db2c953608dd86"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { auth, database as db, storage };
export default app; 
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5Cp7yxorn5RtLww3baSzq8uPtA_F4A68",
  authDomain: "stack-runner-377412.firebaseapp.com",
  projectId: "stack-runner-377412",
  storageBucket: "stack-runner-377412.appspot.com",
  messagingSenderId: "338109493659",
  appId: "1:338109493659:web:37295484e483c80526713e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };

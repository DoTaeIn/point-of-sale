// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCO33H38ijylyCLJK-wIzdHONZmCjQnaWk",
  authDomain: "jaemu-ec0af.firebaseapp.com",
  databaseURL: "https://jaemu-ec0af-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jaemu-ec0af",
  storageBucket: "jaemu-ec0af.appspot.com",
  messagingSenderId: "15198949703",
  appId: "1:15198949703:web:5f8af57210b50d137afc62",
  measurementId: "G-Y94G6Y9WCZ",
  databseURL: "https://jaemu-ec0af-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
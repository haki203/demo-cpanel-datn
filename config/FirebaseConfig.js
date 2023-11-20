// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtx6JdeM0G-nZzRH45yPlne2n-UStI0QQ",
  authDomain: "ttdn1-997ef.firebaseapp.com",
  projectId: "ttdn1-997ef",
  storageBucket: "ttdn1-997ef.appspot.com",
  messagingSenderId: "604464843561",
  appId: "1:604464843561:web:4e1930f3b39c6af748c538",
  measurementId: "G-P62D7SGVSF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

module.exports = app
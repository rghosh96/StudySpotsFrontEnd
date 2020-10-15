import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

var firebaseConfig = {
  apiKey: "AIzaSyBgE-SdwzhqEjI0zOb7bR6qXkw0qEHGGBA",
  authDomain: "study-spots-717b8.firebaseapp.com",
  databaseURL: "https://study-spots-717b8.firebaseio.com",
  projectId: "study-spots-717b8",
  storageBucket: "study-spots-717b8.appspot.com",
  messagingSenderId: "111449438607",
  appId: "1:111449438607:web:02a0b1953bbca15b3d73fa",
  measurementId: "G-T4YVXG5F62"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();


export default firebase;

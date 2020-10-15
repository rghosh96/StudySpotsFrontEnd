import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

var firebaseConfig = {
  REACT_APP_API_KEY=AIzaSyBgE-SdwzhqEjI0zOb7bR6qXkw0qEHGGBA
  REACT_APP_AUTH_DOMAIN=study-spots-717b8.firebaseapp.com
  REACT_APP_DATABASE_URL=https://study-spots-717b8.firebaseio.com
  REACT_APP_PROJECT_ID=study-spots-717b8
  REACT_APP_STORAGE_BUCKET=study-spots-717b8.appspot.com
  REACT_APP_MESSAGING_SENDER_ID=111449438607
  REACT_APP_APP_ID=1:111449438607:web:02a0b1953bbca15b3d73fa
  REACT_APP_MEASUREMENT_ID=G-T4YVXG5F62
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();


export default firebase;

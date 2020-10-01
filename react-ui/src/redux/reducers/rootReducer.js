import { combineReducers } from "redux";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";
import exampleReducer from "./exampleReducer";
import accountReducer from "./accountReducer";

// link global store properties with thier associated reducers
export default combineReducers({
    example: exampleReducer,
    account: accountReducer,
    firebase: firebaseReducer,
    firestore: firestoreReducer
})
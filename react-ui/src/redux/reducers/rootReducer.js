import accountReducer from './accountReducer'
import { combineReducers } from 'redux'
import { firebaseReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore'



const rootReducer = combineReducers({
    auth: accountReducer,
    firebase: firebaseReducer,
    firestore: firestoreReducer
})

export default rootReducer
import {  SIGN_UP_REQUEST, SIGN_UP_FAILURE, SIGN_UP_SUCCESS,
    UPDATE_ACCOUNT_REQUEST, UPDATE_ACCOUNT_SUCCESS, UPDATE_ACCOUNT_FAILURE, 
    SIGN_IN_REQUEST, SIGN_IN_SUCCESS, SIGN_IN_FAILURE, 
    FETCH_USERDATA_REQUEST, FETCH_USERDATA_SUCCESS, FETCH_USERDATA_FAILURE } from '../actions/types';
import { INTERNAL_SERVER, EXISTING_ACCOUNT, BAD_CREDENTIALS, USER_NOT_SIGNED_IN } from '../errorMessages';
import { getFirebase } from 'react-redux-firebase'


export const checkAuth = () => dispatch => {
	const firebase = getFirebase(); //connect to firebase
	
	// what if guest user? what happens when they refresh and have no acct?
	// maybe include a link to signin on the signup page
	firebase.auth().onAuthStateChanged((user) => {
		if (!user) {
			userSignIn();
		}
	});
}

/* signInData = {
	email: <string>,
	password: <string>,
	provider: <string>  // e.g. "google". if not using third-party auth, set to null
} */
export const userSignIn = (signInData) => dispatch => {
	console.log("enter userSignIn")
	dispatch({ type: SIGN_IN_REQUEST });
	
	const firebase = getFirebase(); //connect to firebase
	
	firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
	.then(() => {
			// Existing and future Auth states are now persisted in the current
			// session only. Closing the window would clear any existing state even
			// if a user forgets to sign out.
			// ...
			// New sign-in will be persisted with session persistence.
			return firebase.auth().signInWithEmailAndPassword(signInData.email, signInData.password);
		})
		.then(() => {
			fetchUserData(dispatch);
			console.log("signin success")
			dispatch({ type: SIGN_IN_SUCCESS });
		})
		.catch((error) => {
			console.log(error.message)
			dispatch({
				type: SIGN_IN_FAILURE,
				payload: error.message
			})
		});
};

function fetchUserData(dispatch) {
	console.log("enter fetchUserData")
	dispatch({ type: FETCH_USERDATA_REQUEST });

	const firebase = getFirebase(); //connect to firebase
	const firestore = getFirebase().firestore();

	const user = firebase.auth().currentUser;
	
	console.log(JSON.stringify(user))
	
	if (user) {
		firestore.collection('users').doc(user.uid.toString()).get()
		.then(doc => {
				console.log("doc: " + doc)
				const userData = doc.data();
				console.log(userData);
				
				dispatch({
					type: FETCH_USERDATA_SUCCESS,
					payload: userData
				});
			})
			.catch(error => {
				console.log(error.message)
				dispatch({
					type: FETCH_USERDATA_FAILURE,
					payload: error.message
				});
			});
	} else {
		dispatch({
			type: FETCH_USERDATA_FAILURE,
			payload: USER_NOT_SIGNED_IN
		});
	}
}

/* signUpData = {
	fName: <string>,
	lName: <string>,
	state: <string>,  // length 2
	zipcode: <int>,
	email: <string>,
	password: <string>,
	confirmPwd: <string>,
	musicPref: <int>,     // value 1-5, user preference of ambient music volume (5 = highest volume)
	spacePref: <int>,     // spaciousness pref (5 = most spacious)
	lightingPref: <int>,  // lighting (5 = brightest)
	foodPref: <int>       // importance of food/drink quality pref (5 = most important)
} */
export const userSignUp = (signUpData) => dispatch => {
	console.log("enter userSignUp")
	dispatch({ type: SIGN_UP_REQUEST });
	
	const firebase = getFirebase(); //connect to firebase
	
	firebase.auth().createUserWithEmailAndPassword( //create user
		signUpData.email,
		signUpData.password
	).then(() => { //if success or error
		dispatch({ type: 'SIGN_UP_SUCCESS' }) //### need to add action.payload
		updateUserAccount(signUpData)(dispatch)
		fetchUserData(dispatch);
	}).catch(error => {
		console.log(error.message)
		dispatch({
			type: 'SIGN_UP_FAILURE',
			payload: error.message
		})
	})
};

/* userData = {
	fName: <string>,
	lName: <string>,
	state: <string>,  // length 2
	zipcode: <int>,
	email: <string>,
	newPassword: <string>,
	confirmNewPwd: <string>,
	musicPref: <int>,     // value 1-5, user preference of ambient music volume (1 = lowest volume)
	spacePref: <int>,     // as above for spaciousness (1 = least spacious)
	lightingPref: <int>,  // as above for lighting (1 = dimmest)
	foodPref: <int>       // as above for importance of food/drink quality (1 = least important)
} */
export const updateUserAccount = (userData) => dispatch => {
	console.log("enter updateUserAccount")
	dispatch({ type: UPDATE_ACCOUNT_REQUEST });

	const firebase = getFirebase(); //connect to firebase
	const firestore = getFirebase().firestore();

	firestore.collection('users').doc(firebase.auth().currentUser.uid.toString()).set({
		fName: userData.fName,
		lName: userData.lName,
		state: userData.state,
		zipcode: userData.zipcode,
		musicPref: userData.musicPref,
		spacePref: userData.spacePref,
		lightingPref: userData.lightingPref,
		foodPref: userData.foodPref
		//### currently not sending all data(only firstname lastname)
	}).then(() => {
		dispatch({ type: UPDATE_ACCOUNT_SUCCESS });
		// should we call fetchUserData() here just in case?
	}).catch(error => {
		console.log(error.message)
		dispatch({ 
			type: UPDATE_ACCOUNT_FAILURE,
			payload: error.message
		});
	})
};

const wait = time => new Promise((resolve) => setTimeout(resolve, time));

function mockSignIn(signInData, dispatch) {
	// for now, here is a mock sign in with a 2 second delay to simulate processing.
	// requires email "email" and password "password" for success
	// populates store with mock userData on success
	dispatch({
		type: SIGN_IN_REQUEST
	})
	
	wait(2000)
	.then(() => {
		if (signInData.email === 'email' && signInData.password === 'password') {
				let userData = {
					fName: 'Faker',
					lName: 'McFakerson',
					state: 'ZZ',
					zipcode: 12345,
					email: 'email',
					musicPref: 3,
					spacePref: 2,
					lightingPref: 5,
					foodPref: 1
				};

				dispatch({
					type: SIGN_IN_SUCCESS,
					payload: userData
				});
			} else {
				dispatch({
					type: SIGN_IN_FAILURE,
					payload: BAD_CREDENTIALS
				});
			}
		});
}

function mockSignUp(signUpData, dispatch) {
	dispatch({
		type: SIGN_UP_REQUEST
	})
	
	wait(2000)
		.then(() => {
			if (signUpData.email === 'email') {
				dispatch({
					type: SIGN_UP_FAILURE,
					payload: EXISTING_ACCOUNT
				});
			} else {
				let userData = {
					fName: signUpData.fName,
					lName: signUpData.lName,
					state: signUpData.state,
					zipcode: signUpData.zipcode,
					email: signUpData.email,
					musicPref: signUpData.musicPref,
					spacePref: signUpData.spacePref,
					lightingPref: signUpData.lightingPref,
					foodPref: signUpData.foodPref
				};

				dispatch({
					type: SIGN_UP_SUCCESS,
					payload: userData
				});
			}
		});
}

function mockUpdateAccount(userData, dispatch) {
	dispatch({
		type: UPDATE_ACCOUNT_REQUEST
	})

	wait(2000)
		.then(() => {
			let userNewData = {
				fName: userData.fName,
				lName: userData.lName,
				zipcode: userData.zipcode,
				email: userData.email,
				musicPref: userData.musicPref,
				spacePref: userData.spacePref,
				lightingPref: userData.lightingPref,
				foodPref: userData.foodPref
			};

			dispatch({
				type: UPDATE_ACCOUNT_SUCCESS,
				payload: userNewData
			});
		});
}
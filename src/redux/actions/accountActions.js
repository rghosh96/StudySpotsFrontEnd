import {  SIGN_UP_REQUEST, SIGN_UP_FAILURE, SIGN_UP_SUCCESS } from './types';
import { UPDATE_ACCOUNT_REQUEST, UPDATE_ACCOUNT_SUCCESS, UPDATE_ACCOUNT_FAILURE } from './types';
import { SIGN_IN_REQUEST, SIGN_IN_SUCCESS, SIGN_IN_FAILURE } from './types';
import { INTERNAL_SERVER, EXISTING_ACCOUNT, BAD_CREDENTIALS } from '../errorMessages';

const wait = time => new Promise((resolve) => setTimeout(resolve, time));

/* signInData = {
	email: <string>,
	password: <string>,
	provider: <string>  // e.g. "google". if not using third-party auth, set to null
} */
export const userSignIn = (signInData) => dispatch => {
    // Firebase signin here. will require multiple dispatches: SIGN_IN_REQUEST to 
	// set a loading flag, SIGN_IN_SUCCESS that passes userData in the format defined
	// in the reducer, and SIGN_IN_FAILURE
	
	mockSignIn(signInData, dispatch);
};

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

/* signUpData = {
    fName: <string>,
	lName: <string>,
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
	mockSignUp(signUpData, dispatch);
};

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

/* userData = {
    fName: <string>,
	lName: <string>,
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
    mockUpdateAccount(userData, dispatch);
};

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
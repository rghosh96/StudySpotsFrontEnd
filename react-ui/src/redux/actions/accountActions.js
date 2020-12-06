import {
	SIGN_UP_REQUEST, SIGN_UP_FAILURE, SIGN_UP_SUCCESS, SIGN_OUT_REQUEST, SIGN_OUT_SUCCESS,
	UPDATE_ACCOUNT_REQUEST, UPDATE_ACCOUNT_SUCCESS, UPDATE_ACCOUNT_FAILURE,
	SIGN_IN_REQUEST, SIGN_IN_SUCCESS, SIGN_IN_FAILURE,
	FETCH_USERDATA_REQUEST, FETCH_USERDATA_SUCCESS, FETCH_USERDATA_FAILURE,
	SAVE_SPOT, REMOVE_SAVED_SPOT
} from '../actions/types';
import { EXISTING_ACCOUNT, BAD_CREDENTIALS, USER_NOT_SIGNED_IN, SPOT_SAVED, SPOT_REMOVED } from '../errorMessages';
import { getFirebase } from 'react-redux-firebase';
import {
    getUserId, appendToDocArray, removeFromDocArray
} from '../../services/firebaseService';


export const checkAuth = () => dispatch => {
	const firebase = getFirebase(); //connect to firebase

	// what if guest user? what happens when they refresh and have no acct?
	// maybe include a link to signin on the signup page
	firebase.auth().onAuthStateChanged((user) => {
		console.log(user)
		if (user) {
			dispatch({ type: SIGN_IN_SUCCESS });
			fetchUserData()(dispatch);
		} else {
			dispatch({ 
				type: SIGN_IN_FAILURE,
				payload: USER_NOT_SIGNED_IN
			});
		}
	});
}

/* signInData = {
	email: <string>,
	password: <string>,
	provider: <string>  // e.g. "google". if not using third-party auth, set to null
} */
export const userSignIn = (signInData) => dispatch => {
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
			fetchUserData()(dispatch);
			dispatch({ type: SIGN_IN_SUCCESS });
		})
		.catch((error) => {
			dispatch({
				type: SIGN_IN_FAILURE,
				payload: error.message
			})
		});
};

export const fetchUserData = () => dispatch => {
	dispatch({ type: FETCH_USERDATA_REQUEST });

	const firebase = getFirebase(); //connect to firebase
	const firestore = getFirebase().firestore();

	const user = firebase.auth().currentUser;

	if (user) {
		firestore.collection('users').doc(user.uid.toString()).get()
			.then(doc => {
				const userData = doc.data();
				dispatch({
					type: FETCH_USERDATA_SUCCESS,
					payload: userData
				});
			})
			.catch(error => {
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
	email: <string>,
	password: <string>,
	confirmPwd: <string>,
	musicPref: <int>,     // value 1-5, user preference of ambient music volume (5 = highest volume)
	spacePref: <int>,     // spaciousness pref (5 = most spacious)
	lightingPref: <int>,  // lighting (5 = brightest)
	foodPref: <int>       // importance of food/drink quality pref (5 = most important)
} */
export const userSignUp = (signUpData) => dispatch => {
	dispatch({ type: SIGN_UP_REQUEST });

	const firebase = getFirebase(); //connect to firebase

	firebase.auth().createUserWithEmailAndPassword( //create user
		signUpData.email,
		signUpData.password
	).then(() => { //if success or error
		dispatch({ type: 'SIGN_UP_SUCCESS' }) //### need to add action.payload
		updateUserAccount(signUpData)(dispatch)
		fetchUserData()(dispatch);
	}).catch(error => {
		dispatch({
			type: 'SIGN_UP_FAILURE',
			payload: error.message
		})
	})
};

// // Atomically remove a region from the "regions" array field.
// washingtonRef.update({
// 	regions: firebase.firestore.FieldValue.arrayRemove("east_coast")
// });


/* userData = {
	fName: <string>,
	lName: <string>,
	email: <string>,
	newPassword: <string>,
	confirmNewPwd: <string>,
	musicPref: <int>,     // value 1-5, user preference of ambient music volume (1 = lowest volume)
	spacePref: <int>,     // as above for spaciousness (1 = least spacious)
	lightingPref: <int>,  // as above for lighting (1 = dimmest)
	foodPref: <int>       // as above for importance of food/drink quality (1 = least important)
} */
export const updateUserAccount = (userData) => dispatch => {
	dispatch({ type: UPDATE_ACCOUNT_REQUEST });

	const firebase = getFirebase(); //connect to firebase
	const firestore = getFirebase().firestore();
	const user = firebase.auth().currentUser;

	if (!user) {
		dispatch({
			type: UPDATE_ACCOUNT_FAILURE,
			errorMsg: USER_NOT_SIGNED_IN
		})
	} else {
		firestore.collection('users').doc(user.uid.toString()).set({
			fName: userData.fName,
			lName: userData.lName,
			musicPref: userData.musicPref,
			spacePref: userData.spacePref,
			lightingPref: userData.lightingPref,
			foodPref: userData.foodPref,
			savedSpots: userData.savedSpots || []
		}).then(() => {
			dispatch({ type: UPDATE_ACCOUNT_SUCCESS });
			// should we call fetchUserData() here just in case?
		}).catch(error => {
			dispatch({
				type: UPDATE_ACCOUNT_FAILURE,
				payload: error.message
			});
		})
	}
};

// adds placeId to the current user's savedSpots in Firestore, then calls 
// spotsActions.fetchSpotDetails(), and the details are passed into the reducer
// to create a new entry in the redux savedSpots Map
export const saveSpot = (placeId) => (dispatch) => {
    dispatch({
        type: SAVE_SPOT,
        payload: {
            savingSpot: true
        }
    });

    getUserId()
        .then(userId => {
            return appendToDocArray("users", userId, "savedSpots", placeId)
        })
        .then(docRef => {
            dispatch({
                type: SAVE_SPOT,
                payload: {
					errorMsg: SPOT_SAVED,
					placeId: placeId,
                    savingSpot: false
                }
            });
        })
        .then(() => {
            // once the placeId has been added to Firestore, get the data for that spot
            // fetchSavedSpotsDetails([placeId])(dispatch);
        })
        .catch(error => {
            dispatch({
                type: SAVE_SPOT,
                payload: {
                    errorMsg: error.message,
                    savingSpot: false
                }
            });
        });
}

// removes the placeId from the user's Firestore array of saved spots, then 
// dispatches to remove the place data from redux store
export const removeSavedSpot = (placeId) => (dispatch) => {
    dispatch({
        type: REMOVE_SAVED_SPOT,
        payload: {
            removingSpot: true
        }
    });

    getUserId()
        .then(userId => {
            return removeFromDocArray("users", userId, "savedSpots", placeId);
        })
        .then(() => {
            dispatch({
                type: REMOVE_SAVED_SPOT,
                payload: {
                    errorMsg: SPOT_REMOVED,
                    removingSpot: false,
                    placeId: placeId
                }
            });
        })
        .catch(error => {
            dispatch({
                type: REMOVE_SAVED_SPOT,
                payload: {
                    errorMsg: error.message,
                    removingSpot: false
                }
            });
        });
}

export const userSignOut = () => dispatch => {
	dispatch({ type: SIGN_OUT_REQUEST });
	const firebase = getFirebase();

	firebase.auth().signOut().then(() => {
		dispatch({ type: SIGN_OUT_SUCCESS });
	});

	//Add else SIGN_OUT_FAILURE
}



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
					email: signUpData.email,
					musicPref: signUpData.musicPref,
					spacePref: signUpData.spacePref,
					lightingPref: signUpData.lightingPref,
					foodPref: signUpData.foodPref,
					savedSpots: []
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
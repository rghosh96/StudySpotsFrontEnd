import { SIGN_IN_REQUEST, SIGN_UP_REQUEST, UPDATE_ACCOUNT_REQUEST, FETCH_USER_DATA, SIGN_IN_SUCCESS, SIGN_IN_FAILURE } from './types'

const wait = time => new Promise((resolve) => setTimeout(resolve, time));

/* signInData = {
	email: <string>,
	password: <string>,
	provider: <string>  // e.g. "google". if not using third-party auth, set to null
} */
export const userSignIn = (signInData) => dispatch => {
    // Firebase signin here. will probably require multiple asynchronous dispatches: SIGN_IN to 
    // set a loading flag and FETCH_USER_DATA to send the user's data once the Firebase signin is resolved.
	mockSignIn(signInData);
};

const mockSignIn = (signInData) => dispatch => {
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
				}

				dispatch({
					type: SIGN_IN_SUCCESS,
					payload: userData
				})
			} else {
				dispatch({
					type: SIGN_IN_FAILURE
				})
			}
		})
};


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
    // dispatch({
    //     type: 
    //     payload:
    // })
};


/* accountData = {
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
export const updateUserAccount = (accountData) => dispatch => {
    // dispatch({
    //     type: 
    //     payload:
    // })
};
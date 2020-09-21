import { SIGN_IN, SIGN_UP, UPDATE_ACCOUNT, FETCH_USER_DATA } from './types'

/* signInData = {
	email: <string>,
	password: <string>,
	provider: <string>  // e.g. "google". if not using third-party auth, set to null
} */
export const userSignIn = (signInData) => dispatch => {
    // Firebase signin here. will probably require multiple asynchronous dispatches: SIGN_IN to 
    // set a loading flag and FETCH_USER_DATA to send the user's data once the Firebase signin is resolved.
    
    // dispatch({
    //     type: 
    //     payload: 
    // })
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
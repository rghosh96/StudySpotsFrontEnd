import { SIGN_IN_REQUEST, SIGN_UP_REQUEST, UPDATE_ACCOUNT_REQUEST, FETCH_USER_DATA, SIGN_IN_SUCCESS, SIGN_IN_FAILURE } from '../actions/types';

const initialState = {
    signingUp: false,
    siginingIn: false,
    isSignedIn: false,
    userData: {
        fName: null,
	    lName: null,
	    zipcode: null,
	    email: null,
	    musicPref: null,
	    spacePref: null,
	    lightingPref: null,
	    foodPref: null
    }
}

export default function(state = initialState, action) {
    switch(action.type) {

        case SIGN_IN_REQUEST: 
            return {
                ...state,
                siginingIn: true
            }

        case SIGN_IN_SUCCESS:
            return {
                ...state,
                signingIn: false,
                isSignedIn: true,
                userData: action.payload
            }
        
        case SIGN_IN_FAILURE:
            return {
                ...state,
                signingIn: false,
                isSignedIn: false
            }    

        case SIGN_UP_REQUEST:
            return {
                ...state,
                isLoading: action.payload
            }

        case UPDATE_ACCOUNT_REQUEST:
            return {
                ...state,
                isLoading: action.payload
            }

        case FETCH_USER_DATA:
            return {
                ...state,
                isLoading: false,
                userData: action.payload
            }

        default:
            return state
    }
}
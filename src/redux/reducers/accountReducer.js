import {  SIGN_UP_REQUEST, SIGN_UP_FAILURE, SIGN_UP_SUCCESS } from '../actions/types';
import { UPDATE_ACCOUNT_REQUEST, UPDATE_ACCOUNT_SUCCESS, UPDATE_ACCOUNT_FAILURE } from '../actions/types';
import { SIGN_IN_REQUEST, SIGN_IN_SUCCESS, SIGN_IN_FAILURE } from '../actions/types';
import { SUCCESS } from '../errorMessages'

const initialState = {
    signingUp: false,
    signingIn: false,
    isSignedIn: false,
    updatingAccount: false,
    userData: {
        fName: null,
	    lName: null,
        zipcode: null,
        state: null,
        email: null,
	    musicPref: null,
	    spacePref: null,
	    lightingPref: null,
	    foodPref: null
    },
    errorMsg: SUCCESS
}

export default function(state = initialState, action) {
    switch(action.type) {

        case SIGN_IN_REQUEST: 
            return {
                ...state,
                signingIn: true
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
                isSignedIn: false,
                errorMsg: action.payload
            }    

        case SIGN_UP_REQUEST:
            return {
                ...state,
                signingUp: true
            }

        case SIGN_UP_SUCCESS:
            return {
                ...state,
                signingUp: false,
                isSignedIn: true,
                userData: action.payload
            }

        case SIGN_UP_FAILURE:
            return {
                ...state,
                signingUp: false,
                isSignedIn: false,
                errorMsg: action.payload
            }

        case UPDATE_ACCOUNT_REQUEST:
            return {
                ...state,
                updatingAccount: true
            }

        case UPDATE_ACCOUNT_SUCCESS:
            return {
                ...state,
                updatingAccount: false,
                userData: action.payload
            }

        case UPDATE_ACCOUNT_FAILURE:
            return {
                ...state,
                updatingAccount: false,
                errorMsg: action.payload
            }

        default:
            return state
    }
}
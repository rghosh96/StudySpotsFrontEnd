import {  SIGN_UP_REQUEST, SIGN_UP_FAILURE, SIGN_UP_SUCCESS, SIGN_OUT_REQUEST, SIGN_OUT_SUCCESS, SIGN_OUT_FAILURE,
    UPDATE_ACCOUNT_REQUEST, UPDATE_ACCOUNT_SUCCESS, UPDATE_ACCOUNT_FAILURE, 
    SIGN_IN_REQUEST, SIGN_IN_SUCCESS, SIGN_IN_FAILURE, 
    FETCH_USERDATA_REQUEST, FETCH_USERDATA_SUCCESS, FETCH_USERDATA_FAILURE } from '../actions/types';
import { SUCCESS } from '../errorMessages'

const initialState = {
    signingUp: false,
    signingIn: false,
    signingOut: false,
    isSignedIn: false,
    updatingAccount: false,
    fetchingUserData: false,
    userDataFetched: false,
    userData: {     // might have to init to nulls if frontend has problems
        fName: '',
	    lName: '',
        zipcode: '',
        state: '',
        email: '',
	    musicPref: [],
	    spacePref: [],
	    lightingPref: [],
	    foodPref: []
    },
    errorMsg: ''
};

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
                errorMsg: SUCCESS
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
                errorMsg: SUCCESS
            }

        case SIGN_UP_FAILURE:
            return {
                ...state,
                signingUp: false,
                isSignedIn: false,
                errorMsg: action.payload
            }

        case SIGN_OUT_REQUEST:
            return {
                ...state,
                signingOut: true
            }
        case SIGN_OUT_SUCCESS:
            return {
                ...state,
                signingOut: false,
                isSignedIn: false,
                userData: [],
                errorMsg: SUCCESS
            }

        case SIGN_OUT_FAILURE:
            return {
                ...state,
                signingOut: false,
                isSignedIn: true,
                userData: [],
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
                errorMsg: SUCCESS
            }

        case UPDATE_ACCOUNT_FAILURE:
            return {
                ...state,
                updatingAccount: false,
                errorMsg: action.payload
            }

        case FETCH_USERDATA_REQUEST:
            return {
                ...state,
                fetchingUserData: true
            }

        case FETCH_USERDATA_SUCCESS:
            return {
                ...state,
                fetchingUserData: false,
                userDataFetched: true,
                userData: action.payload,
                errorMsg: SUCCESS
            }

        case FETCH_USERDATA_FAILURE:
            return {
                ...state,
                fetchingUserData: false,
                userDataFetched: false,
                errorMsg: action.payload
            }

        default:
            return state
    }
}
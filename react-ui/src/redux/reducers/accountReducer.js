import {  SIGN_UP_REQUEST, SIGN_UP_FAILURE, SIGN_UP_SUCCESS,
    UPDATE_ACCOUNT_REQUEST, UPDATE_ACCOUNT_SUCCESS, UPDATE_ACCOUNT_FAILURE, 
    SIGN_IN_REQUEST, SIGN_IN_SUCCESS, SIGN_IN_FAILURE, 
    FETCH_USERDATA_REQUEST, FETCH_USERDATA_SUCCESS, FETCH_USERDATA_FAILURE } from '../actions/types';
import { SUCCESS } from '../errorMessages'

const initialState = {
    signingUp: false,
    signingIn: false,
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
                isSignedIn: true
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
                isSignedIn: true
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
                updatingAccount: false
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
                userData: action.payload
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
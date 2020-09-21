import { SIGN_IN, SIGN_UP, UPDATE_ACCOUNT, FETCH_USER_DATA } from '../actions/types';

const initialState = {
    isLoading: false,
    userData: {}
}

export default function(state = initialState, action) {
    switch(action.type) {

        case SIGN_IN: 
            return {
                ...state,
                isLoading: action.payload
            }

        case SIGN_UP:
            return {
                ...state,
                isLoading: action.payload
            }

        case UPDATE_ACCOUNT: 
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
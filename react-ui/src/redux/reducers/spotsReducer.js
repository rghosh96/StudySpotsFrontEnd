import { FETCH_SPOTS_REQUEST, FETCH_SPOTS_SUCCESS, FETCH_SPOTS_FAILURE } from '../actions/types';
import { SUCCESS, BAD_SPOTS_FETCH } from '../errorMessages'

const initialState = {
    fetchingSpots: false,
    spotsFetched: false,
    spots: [],
    errorMsg: ''
};

export default function(state = initialState, action) {
    switch(action.type) {

        case FETCH_SPOTS_REQUEST: 
            return {
                ...state,
                fetchingSpots: true
            }

        case FETCH_SPOTS_SUCCESS:
            return {
                ...state,
                fetchingSpots: false,
                spotsFetched: true,
                spots: action.payload,
                errorMsg: SUCCESS
            }
        
        case FETCH_SPOTS_FAILURE:
            return {
                ...state,
                fetchingSpots: false,
                spotsFetched: false,
                errorMsg: action.payload
            }    

        default:
            return state
    }
}
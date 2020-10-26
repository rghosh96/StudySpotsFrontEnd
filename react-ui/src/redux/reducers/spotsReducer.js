import {
    FETCH_SPOTS_REQUEST, FETCH_SPOTS_SUCCESS, FETCH_SPOTS_FAILURE,
    FETCH_SPOTS_CONSTANTS_SUCCESS, FETCH_SPOTS_CONSTANTS_FAILURE,
    FETCH_SPOT_DETAILS_REQUEST, FETCH_SPOT_DETAILS_SUCCESS, FETCH_SPOT_DETAILS_FAILURE,
	SAVE_SPOT, REMOVE_SAVED_SPOT, FETCH_SAVED_SPOTS,
} from '../actions/types';
import { SUCCESS, BAD_SPOTS_FETCH } from '../errorMessages'

const initialState = {
    fetchingSpots: false,
    spotsFetched: false,     // would like to remove this if no one is using
    constantsFetched: false, // would like to remove this if no one is using

    // the constants are arrays of the form: [{display: <string>, api: <string>}, ...]
    // frontend usage: 
    // constants.map(c => {
    //     return <option value={c.api}>{c.display}</option>
    // })
    businessStatusConstants: [],
    languageConstants: [],
    priceLevelConstants: [],
    rankByConstants: [],
    typeConstants: [],

    spots: [],
    savedSpots: new Map(),
    activeSpot: {},
    errorMsg: ''
};

export default function (state = initialState, action) {
    switch (action.type) {

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
                errorMsg: action.payload
            }

        case FETCH_SPOTS_CONSTANTS_SUCCESS:
            return {
                ...state,
                constantsFetched: true,
                businessStatusConstants: action.payload.businessStatusConstants,
                languageConstants: action.payload.languageConstants,
                priceLevelConstants: action.payload.priceLevelConstants,
                rankByConstants: action.payload.rankByConstants,
                typeConstants: action.payload.typeConstants,
                errorMsg: SUCCESS
            }

        case FETCH_SPOTS_CONSTANTS_FAILURE:
            return {
                ...state,
                constantsFetched: false,
                errorMsg: action.payload
            }

        case SAVE_SPOT:
            return {
                ...state,
                savingSpot: action.payload.savingSpot,
                errorMsg: action.payload.errorMsg,
                savedSpots: action.payload.spotDetails ?
                    state.savedSpots.set(action.payload.placeId)
                    : state.savedSpots,
            }

        case FETCH_SPOT_DETAILS_REQUEST:
            return {
                ...state,
                fetchingSpots: true
            }

        case FETCH_SPOT_DETAILS_SUCCESS:
            return {
                ...state,
                fetchingSpots: false,
                activeSpot: action.payload,
                errorMsg: SUCCESS
            }

        case FETCH_SPOT_DETAILS_FAILURE:
            return {
                ...state,
                fetchingSpots: false,
                errorMsg: action.payload
            }

        default:
            return state
    }
}
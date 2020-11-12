import {
    FETCH_SPOTS_REQUEST, FETCH_SPOTS_SUCCESS, FETCH_SPOTS_FAILURE,
    FETCH_SPOTS_CONSTANTS_SUCCESS, FETCH_SPOTS_CONSTANTS_FAILURE,
    FETCH_SPOT_DETAILS,
    SAVE_SPOT, REMOVE_SAVED_SPOT, FETCH_SAVED_SPOTS_DETAILS,
    SUBMIT_RATING, UPDATE_RATING
} from '../actions/types';
import { SUCCESS } from '../errorMessages'

const initialState = {
    savingSpot: false,
    removingSpot: false,
    submittingRating: false,
    fetchingSpots: false,
    spotsFetched: false,
    constantsFetched: false, 

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
    savedSpots: [],
    activeSpot: {},
    errorMsg: ''
};

export default function (state = initialState, action) {
    var updatedSavedSpots = null;

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

        case FETCH_SPOT_DETAILS:
            return {
                ...state,
                fetchingSpots: action.payload.fetchingSpots,
                spotsFetched: action.payload.spotsFetched || state.spotsFetched,
                activeSpot: action.payload.spotDetails || state.activeSpot,
                errorMsg: action.payload.errorMsg || ''
            }

        case FETCH_SAVED_SPOTS_DETAILS:
            updatedSavedSpots = null;
            if (action.payload.spotsDetails) {
                updatedSavedSpots = [action.payload.spotsDetails, ...state.savedSpots];
            }

            return {
                ...state,
                fetchingSpots: action.payload.fetchingSpots,
                spotsFetched: action.payload.spotsFetched || state.spotsFetched,
                errorMsg: action.payload.errorMsg || '',
                savedSpots: updatedSavedSpots || state.savedSpots
            }

        case SAVE_SPOT:
            return {
                ...state,
                savingSpot: action.payload.savingSpot,
                errorMsg: action.payload.errorMsg || '',

            }

        case REMOVE_SAVED_SPOT:
            updatedSavedSpots = null;
            if (action.payload.placeId) {
                updatedSavedSpots = state.savedSpots.filter(
                    spot => spot.placeId !== action.payload.placeId
                );
            }

            return {
                ...state,
                removingSpot: action.payload.removingSpot,
                errorMsg: action.payload.errorMsg || '',
                // on error, no spot is removed
                savedSpots: updatedSavedSpots || state.savedSpots
            }

        case SUBMIT_RATING:
            return {
                ...state,
                submittingRating: action.payload.submittingRating,
                errorMsg: action.payload.errorMsg || '',
            }

        case UPDATE_RATING:
            return {
                ...state,
                submittingRating: action.payload.submittingRating,
                errorMsg: action.payload.errorMsg || '',
            }

        default:
            return state
    }
}
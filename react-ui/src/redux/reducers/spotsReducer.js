import {
    FETCH_SPOTS_REQUEST, FETCH_SPOTS_SUCCESS, FETCH_SPOTS_FAILURE,
    FETCH_SPOTS_CONSTANTS_SUCCESS, FETCH_SPOTS_CONSTANTS_FAILURE,
    FETCH_SPOT_DETAILS,
FETCH_SAVED_SPOTS_DETAILS,
    SUBMIT_RATING, UPDATE_RATING, CREATE_COMMENT, DELETE_COMMENT, UPDATE_COMMENT, FETCH_COMMENTS_SUCCESS, FETCH_COMMENTS_FAILURE, FETCH_COMMENTS_REQUEST,
    CLEAR_ACTIVE_SPOT,
    REMOVE_SAVED_SPOT_DETAILS
} from '../actions/types';
import { SUCCESS } from '../errorMessages'
import { innerPropSort } from '../../helpers/dataStructureHelpers';

const initialState = {
    creatingComment: false,
    deletingComment: false,
    updatingComment: false,
    fetchingComments: false,
    commentsFetched: false,
    

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
    comments: [],
    savedSpots: [],
    activeSpot: null,
    errorMsg: ''
};

export default function (state = initialState, action) {
    var lastSavedSpotsIds = null;
    var nextSavedSpots = null;
    var nextComments = null;

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
                activeSpot: action.payload.spotDetails ? action.payload.spotDetails : null,
                errorMsg: action.payload.errorMsg || ''
            }

        case CLEAR_ACTIVE_SPOT:
            return {
                ...state,
                activeSpot: null
            }

        case FETCH_SAVED_SPOTS_DETAILS:
            nextSavedSpots = state.savedSpots;
            lastSavedSpotsIds = state.savedSpots.map(spot => {return spot.placeId});
            if (action.payload.spotsDetails && !lastSavedSpotsIds.includes(action.payload.spotsDetails.placeId)) {
                nextSavedSpots.push(action.payload.spotsDetails);
            }

            return {
                ...state,
                fetchingSpots: action.payload.fetchingSpots,
                spotsFetched: action.payload.spotsFetched || state.spotsFetched,
                errorMsg: action.payload.errorMsg || '',
                savedSpots: nextSavedSpots
            }

        case REMOVE_SAVED_SPOT_DETAILS:
            return {
                ...state,
                savedSpots: state.savedSpots.filter(spot => spot.placeId != action.payload.placeId)
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

        case CREATE_COMMENT:
            nextComments = state.comments;
            if (action.payload.newComment) {
                nextComments.push(action.payload.newComment)
                nextComments = innerPropSort(nextComments, 'timestamp', false)
            }

            return {
                ...state,
                creatingComment: action.payload.creatingComment,
                errorMsg: action.payload.errorMsg || '',
                comments: nextComments
            }

        case DELETE_COMMENT:
            console.log('DELETE_COMMENT')
            console.log(action.payload)

            nextComments = state.comments;
            if (action.payload.deletedCommentId) {
                nextComments = nextComments.filter(c => c.commentId != action.payload.deletedCommentId);
            }

            return {
                ...state,
                deletingComment: action.payload.deletingComment,
                errorMsg: action.payload.errorMsg || '',
                comments: nextComments
            }
            
        case FETCH_COMMENTS_REQUEST:
            return {
                ...state,
                fetchingComments: true,
            }

        case FETCH_COMMENTS_SUCCESS:
                nextComments = innerPropSort(action.payload, 'timestamp', false)

            return {
                ...state,
                fetchingComments: false,
                commentsFetched: true,
                comments: action.payload,
                errorMsg: SUCCESS,
            }

        case FETCH_COMMENTS_FAILURE:
            return {
                ...state,
                fetchingComments: false,
                errorMsg: action.payload,
            }

        case UPDATE_COMMENT:
            return {
                ...state,
                updatingComment: action.payload.updatingComment,
                errorMsg: action.payload.errorMsg || '',
            }

        default:
            return state
    }
}

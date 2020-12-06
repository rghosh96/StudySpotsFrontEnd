// Using a dedicated file for our action types isn't necessary per say, but it
// makes it a lot easier to change the type names if we need to (instead of having to
// update action files AND reducer files)
//
// Note that a single action type can be used by multiple actions. A single action
// may also use multiple types (for example, an action that fetches some api data may
// first dispatch a LOADING_DATA that tells the reducer to set an isLoading flag to true, 
// then dispatch a FETCH_DATA with the api data as payload once the request is resolved)

// example types
export const UPDATE_TEXT = 'UPDATE_TEXT';
export const INCREMENT_VALUE = 'INCREMENT_VALUE';

// account types
export const SIGN_IN_REQUEST = 'SIGN_IN_REQUEST';
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS';
export const SIGN_IN_FAILURE = 'SIGN_IN_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const SIGN_OUT_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_OUT_SUCCESS = 'SIGN_OUT_SUCCESS';
export const SIGN_OUT_FAILURE = 'SIGN_OUT_FAILURE';

export const UPDATE_ACCOUNT_REQUEST = 'UPDATE_ACCOUNT_REQUEST';
export const UPDATE_ACCOUNT_SUCCESS = 'UPDATE_ACCOUNT_SUCCESS';
export const UPDATE_ACCOUNT_FAILURE = 'UPDATE_ACCOUNT_FAILURE';

export const FETCH_USERDATA_REQUEST = 'FETCH_USERDATA_REQUEST';
export const FETCH_USERDATA_SUCCESS = 'FETCH_USERDATA_SUCCESS';
export const FETCH_USERDATA_FAILURE = 'FETCH_USERDATA_FAILURE';


// spots actions
export const FETCH_SPOTS_REQUEST = 'FETCH_SPOTS_REQUEST';
export const FETCH_SPOTS_SUCCESS = 'FETCH_SPOTS_SUCCESS';
export const FETCH_SPOTS_FAILURE = 'FETCH_SPOTS_FAILURE';

export const FETCH_SPOT_DETAILS = 'FETCH_SPOT_DETAILS';

export const FETCH_SPOTS_CONSTANTS_SUCCESS = 'FETCH_SPOTS_CONSTANTS_SUCCESS';
export const FETCH_SPOTS_CONSTANTS_FAILURE = 'FETCH_SPOTS_CONSTANTS_FAILURE';

export const SAVE_SPOT = 'SAVE_SPOT';
export const REMOVE_SAVED_SPOT = 'REMOVE_SAVED_SPOT';
export const FETCH_SAVED_SPOT = 'FETCH_SAVED_SPOT';
export const FETCH_SAVED_SPOTS_DETAILS = 'FETCH_SAVED_SPOTS_DETAILS';
export const REMOVE_SAVED_SPOT_DETAILS = 'REMOVE_SAVED_SPOT_DETAILS';

export const SUBMIT_RATING = 'SUBMIT_RATING';
export const UPDATE_RATING = 'UPDATE_RATING';
export const FETCH_RATINGS = 'FETCH_RATINGS';

export const CLEAR_ACTIVE_SPOT = 'CLEAR_ACTIVE_SPOT';

export const CREATE_COMMENT = 'CREATE_COMMENT';
export const DELETE_COMMENT = 'DELETE_COMMENT';
export const UPDATE_COMMENT = 'UPDATE_COMMENT';
export const FETCH_COMMENTS_REQUEST = 'FETCH_COMMENTS_REQUEST';
export const FETCH_COMMENTS_SUCCESS = 'FETCH_COMMENTS_SUCCESS';
export const FETCH_COMMENTS_FAILURE = 'FETCH_COMMENTS_FAILURE';

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

export const UPDATE_ACCOUNT_REQUEST = 'UPDATE_ACCOUNT_REQUEST';
export const UPDATE_ACCOUNT_SUCCESS = 'UPDATE_ACCOUNT_SUCCESS';
export const UPDATE_ACCOUNT_FAILURE = 'UPDATE_ACCOUNT_FAILURE';
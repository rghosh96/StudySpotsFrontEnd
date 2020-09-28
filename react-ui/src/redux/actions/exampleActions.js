// with redux, a react component must call an action in order to request to change a property
// in the state of the redux store.
//
// actions are grouped into files based on what properties in the store they affect. This particular
// file contains all the actions that affect the "example" property of the store.
//
// an action itself doesn't directly change the state of the store. it only sends a "dispatch" to 
// its associated reducer (of a similar name), which handles the state change.
//
// ***most importantly, redux actions neither read nor write to the global store!!! 
//    they are only allowed to deal with api/database and relay information from react components


import { UPDATE_TEXT, INCREMENT_VALUE } from './types'

export const updateSubmittedText = (value) => dispatch => {
    // api fetches and database queries go here
    dispatch({
        type: UPDATE_TEXT, // telling the reducer what type of change this will be 
        payload: value     // the value we are requesting to use for the change
    })
};

export const incrementButtonValue = (value) => dispatch => {
    dispatch({
        type: INCREMENT_VALUE,
        payload: value + 1
    })
};
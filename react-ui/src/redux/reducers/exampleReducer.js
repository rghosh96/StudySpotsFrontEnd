// reducers are the only entities that have direct read/write access to the redux global store.
// they take in requests from actions and change state values accordingly. this reducer changes
// sub-properties of the "example" property in the global redux store
//
// a reducer exports a single function with a switch statement on the action types defined in
// src/actions/types.js
//
// for our purposes, reducers should not get much more complex than this example. the only reason
// we would need to do data processing in a reducer is to change properties that are logically tied to 
// other properties, like isSameValue in this example


import { UPDATE_TEXT, INCREMENT_VALUE } from '../actions/types'

// the initial state of the "example" property in the store
const initialState = {
    submittedText: '',   // the text submitted from a textbox onscreen
    buttonValue: 0,      // the value of a button displayed onscreen
    isSameValue: false   // true if the 2 properties above are == (different from === in JavaScript)
}

export default function(state = initialState, action) {
    switch(action.type) {
        case UPDATE_TEXT: 
            return {
                ...state,
                submittedText: action.payload,
                isSameValue: action.payload === state.buttonValue ? true : false
            }           
        case INCREMENT_VALUE:
            return {
                ...state,
                buttonValue: action.payload,
                isSameValue: action.payload === state.submittedText ? true : false
            }
        default:
            return state
    }
}
import { combineReducers } from "redux";
import exampleReducer from "./exampleReducer";
import accountReducer from "./accountReducer";

// link global store properties with thier associated reducers
export default combineReducers({
    example: exampleReducer,
    account: accountReducer
})
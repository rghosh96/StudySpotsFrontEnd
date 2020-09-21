import { combineReducers } from "redux";
import exampleReducer from "./exampleReducer";
import accountReducer from "./acountReducer";

// link global store properties with thier associated reducers
export default combineReducers({
    example: exampleReducer,
    account: accountReducer
})
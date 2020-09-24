import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};
const middleware = [thunk];
const store = createStore(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(...middleware),

        // enables functionality with the Chrome redux devtools.
        // if app is working locally but not in production, try commenting this out.
        // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
)

export default store;

import React from 'react';
import store from './redux/store'
import { Provider } from 'react-redux'
import ReduxExample from './ReduxExample';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      {/* <Router> goes here */}
      <ReduxExample />
      {/* </Router> */}
    </Provider>
  );
}

export default App;

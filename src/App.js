import React from 'react';
import './styling/master.scss';
import { BrowserRouter, Route } from 'react-router-dom';
import store from './redux/store'
import { Provider } from 'react-redux'
import MySpots from './components/pages/MySpots.js'
import Reviews from './components/pages/Reviews.js'
import Settings from './components/pages/Settings.js'
import Spotlight from './components/pages/Spotlight.js'
import SignIn from './components/pages/SignIn.js'
import SignUp from './components/pages/SignUp.js'

// redux testing components
import TestAccountActions from './components/redux-testing/TestAccountActions';


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
            <Route exact path = '/' component={ Spotlight } />
            <Route exact path = '/signin' component={ SignIn } />
            <Route exact path = '/signup' component={ SignUp } />
            <Route exact path = '/settings' component={ Settings } />
            <Route exact path = '/reviews' component={ Reviews } />
            <Route exact path = '/myspots' component={ MySpots } />

            <Route exact path = '/redux/testaccountactions' component={ TestAccountActions } />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

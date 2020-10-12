import React from 'react';
import './styling/master.scss';
import { BrowserRouter, Route } from 'react-router-dom';
import MySpots from './components/pages/MySpots.js'
import Reviews from './components/pages/Reviews.js'
import Settings from './components/pages/Settings.js'
import Spotlight from './components/pages/Spotlight.js'
import SignIn from './components/pages/SignIn.js'
import SignUp from './components/pages/SignUp.js'

// redux testing components
import TestAccountActions from './components/redux-testing/TestAccountActions';
import TestSpotsActions from './components/redux-testing/TestSpotsActions';
import TestSignOut from './components/redux-testing/TestSignOut';


function App() {
  return (
        <BrowserRouter>
          <div className="App">
            <Route exact path='/' component={Spotlight} />
            <Route exact path='/signin' component={SignIn} />
            <Route exact path='/signup' component={SignUp} />
            <Route exact path='/settings' component={Settings} />
            <Route exact path='/reviews' component={Reviews} />
            <Route exact path='/myspots' component={MySpots} />

            <Route exact path='/redux/testaccountactions' component={TestAccountActions} />
            <Route exact path='/redux/testspotsactions' component={TestSpotsActions} />
            <Route exact path='/redux/signout' component={TestSignOut} />
          </div>
        </BrowserRouter>
  );
}

export default App;

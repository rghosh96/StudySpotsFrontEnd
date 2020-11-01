import React, { useEffect } from 'react';
import './styling/master.scss';
import { BrowserRouter, Route } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { checkAuth } from "./redux/actions/accountActions";

import MySpots from './components/pages/MySpots.js'
import Reviews from './components/pages/Reviews.js'
import Settings from './components/pages/Settings.js'
import Spotlight from './components/pages/Spotlight.js'
import SignIn from './components/pages/SignIn.js'
import SignUp from './components/pages/SignUp.js'
import Header from './components/nav/Header';

// redux testing components
import TestAccountActions from './components/redux-testing/TestAccountActions';
import TestSpotsActions from './components/redux-testing/TestSpotsActions';
import TestSignOut from './components/redux-testing/TestSignOut';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
      <Header />
        <Route exact path='/' component={Spotlight} />
        <Route exact path='/signin' component={SignIn} />
        <Route exact path='/signup' component={SignUp} />
        <Route exact path='/settings' component={Settings} />
        <Route exact path='/reviews' component={Reviews} />
        <Route exact path='/myspots' component={MySpots} />
    
        <Route exact path='/redux/testaccountactions' component={TestAccountActions} />
        <Route exact path='/redux/testspotsactions' component={TestSpotsActions} />
        <Route exact path='/redux/testsignout' component={TestSignOut} />
      </BrowserRouter>
    </div>

  );
}

export default App;

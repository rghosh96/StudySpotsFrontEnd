import React, { useEffect } from 'react';
import './styling/master.scss';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import history from './history';
import { useDispatch } from "react-redux";
import { checkAuth } from "./redux/actions/accountActions";

import MySpots from './components/pages/MySpots.js'
import Spotlight from './components/pages/Spotlight.js'
import SignIn from './components/pages/SignIn.js'
import SignUp from './components/pages/SignUp.js'
import SpotPage from './components/pages/SpotPage.js';

// redux testing components
import TestAccountActions from './components/redux-testing/TestAccountActions';
import TestSpotsActions from './components/redux-testing/TestSpotsActions';
import TestSignOut from './components/redux-testing/TestSignOut';
import { fetchSpotsConstants } from './redux/actions/spotsActions';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(fetchSpotsConstants());
    window.scrollTo(0, 0);
  });

  return (
    <div className="App">
      <Router history={history}>
        <Switch>
          <Route exact path='/' component={Spotlight} />
          <Route exact path='/signin' component={SignIn} />
          <Route exact path='/signup' component={SignUp} />
          <Route exact path='/myspots' component={MySpots} />
          <Route exact path='/spotpage/:placeId' component={SpotPage} />

          <Route exact path='/redux/testaccountactions' component={TestAccountActions} />
          <Route exact path='/redux/testspotsactions' component={TestSpotsActions} />
          <Route exact path='/redux/testsignout' component={TestSignOut} />
        </Switch>
      </Router>
    </div>

  );
}

export default App;

import React from 'react';
import {IndexRoute, Router, Route, hashHistory} from 'react-router';

import MainContainer from '../App';
import HomeContainer from '../components/containers/HomeContainer';
import LoginContainer from '../components/containers/LoginContainer';

const routes = (
  <Router history={hashHistory}>
    <Route path='/' component={MainContainer}>
      <IndexRoute component={HomeContainer} />
      <Route path='/login' component={LoginContainer} />
    </Route>
  </Router>
);

export default routes;

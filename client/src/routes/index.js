import React from 'react';
import {IndexRoute, Router, Route, hashHistory} from 'react-router';

import MainContainer from '../App';
import HomeContainer from '../components/containers/HomeContainer';

const routes = (
  <Router history={hashHistory}>
    <Route path='/' component={MainContainer}>
      <IndexRoute component={HomeContainer} />
    </Route>
  </Router>
);

export default routes;

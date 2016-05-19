/* eslint-disable no-unused-vars */
import React from 'react';
import {Provider} from 'react-redux';
import {IndexRoute, Router, Route, hashHistory} from 'react-router';
/* eslint-enable no-unused-vars */

import configureStore from '../store/configureStore';

import MainContainer from '../containers/Main/MainContainer';
import HomeContainer from '../containers/Home/HomeContainer';

const store = configureStore();

const routes = (
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/' component={MainContainer}>
        <IndexRoute component={HomeContainer} />
      </Route>
    </Router>
  </Provider>
);

export default routes;

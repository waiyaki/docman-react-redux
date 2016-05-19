/* eslint-disable no-unused-vars */
import React from 'react';
import {Provider} from 'react-redux';
import {IndexRoute, Router, Route, hashHistory} from 'react-router';
/* eslint-enable no-unused-vars */

import configureStore from '../configureStore';

import MainContainer from '../App';
import HomeContainer from '../components/containers/HomeContainer';
import LoginContainer from '../components/containers/LoginContainer';
import SignupContainer from '../components/containers/SignupContainer';

const store = configureStore();

const routes = (
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/' component={MainContainer}>
        <IndexRoute component={HomeContainer} />
        <Route path='/login' component={LoginContainer}></Route>
        <Route path='/signup' component={SignupContainer}></Route>
      </Route>
    </Router>
  </Provider>
);

export default routes;

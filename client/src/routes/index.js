/* eslint-disable no-unused-vars */
import React from 'react';
import {Provider} from 'react-redux';
import {IndexRoute, Router, Route, hashHistory} from 'react-router';
/* eslint-enable no-unused-vars */

import configureStore from '../configureStore';
import * as LoginActions from '../actions/LoginActions';

import MainContainer from '../App';
import HomeContainer from '../components/containers/HomeContainer';
import LoginContainer from '../components/containers/LoginContainer';

const store = configureStore();

// Test integration. Logger middleware should log this action.
store.dispatch(LoginActions.loginRequest({
  username: 'test',
  password: 'secure'
}));

const routes = (
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/' component={MainContainer}>
        <IndexRoute component={HomeContainer} />
        <Route path='/login' component={LoginContainer} />
      </Route>
    </Router>
  </Provider>
);

export default routes;

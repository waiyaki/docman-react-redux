import React from 'react';
import {Provider} from 'react-redux';
import {IndexRoute, Router, Route, browserHistory} from 'react-router';

import configureStore from '../store/configureStore';
import MainContainer from '../containers/Main/MainContainer';
import HomeContainer from '../containers/Home/HomeContainer';
import ProfilePageContainer from '../containers/ProfilePage/ProfilePageContainer';

const store = configureStore();

const routes = (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route component={MainContainer} path='/'>
        <IndexRoute component={HomeContainer} />
        <Route component={ProfilePageContainer} path='/:username'/>
      </Route>
    </Router>
  </Provider>
);

export default routes;

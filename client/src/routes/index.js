import React from 'react';
import {Provider} from 'react-redux';
import {IndexRoute, Router, Route, browserHistory} from 'react-router';

import configureStore from '../store/configureStore';
import MainContainer from '../containers/Main/MainContainer';
import HomeContainer from '../containers/Home/HomeContainer';

const store = configureStore();

const HelloWorld = () => (
  <div>Hello World!</div>
);

const routes = (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route component={MainContainer} path='/'>
        <IndexRoute component={HomeContainer} />
        <Route component={HelloWorld} path='/users'/>
      </Route>
    </Router>
  </Provider>
);

export default routes;

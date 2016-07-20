import React from 'react';
import { Provider } from 'react-redux';
import { IndexRoute, Router, Route, browserHistory } from 'react-router';

import MainContainer from '../containers/Main/MainContainer';
import HomeContainer from '../containers/Home/HomeContainer';
import ProfilePageContainer from '../containers/ProfilePage/ProfilePageContainer';
import requireAuthentication from '../containers/Auth/RequireAuthentication';
import NotFoundPage from '../components/NotFound/NotFoundPage';

const Routes = ({ store }) => ( // eslint-disable-line react/prop-types
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route component={MainContainer} path='/'>
        <IndexRoute component={requireAuthentication(HomeContainer)} />
        <Route
          component={requireAuthentication(ProfilePageContainer)}
          path='/:username'
        />
        <Route component={NotFoundPage} path='*' />
      </Route>
    </Router>
  </Provider>
);

export default Routes;

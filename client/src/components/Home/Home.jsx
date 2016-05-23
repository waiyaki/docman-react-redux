import React, {PropTypes} from 'react';
import {Map} from 'immutable';

import MainAppNavBar from './MainAppNavBar';
import UserSidebar from '../UserSidebar/UserSidebar';
import UserSidebarLoading from '../UserSidebar/UserSidebarLoading';

const Home = (props) => {
  const auth = props.auth.toJS();
  return (
    <div className='main-application__body'>
      <MainAppNavBar auth={auth} onLogout={props.onLogout} />
      <div className='main-application__content margin-gt-md'>
        <div className='row'>
          <div className='col-sm-4 col-lg-3 hide-sm-xs'>
            {auth.user && auth.user.username
              ? <UserSidebar user={auth.user} />
              : <UserSidebarLoading />
            }
          </div>
          <div className='col-sm-8 col-lg-9'>
            Hello World from the home component!
          </div>
        </div>
      </div>
    </div>
  );
};

Home.propTypes = {
  auth: function (props, propName, componentName) {
    if (!props[propName] instanceof Map) {
      return new Error(
        `Invalid prop ${propName} supplied to ${componentName}.` +
        'Expected `Immutable.Map`'
      );
    }
  },
  onLogout: PropTypes.func.isRequired
};

export default Home;

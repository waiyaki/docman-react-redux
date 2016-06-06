/* eslint-disable no-unused-vars */
import React, {PropTypes} from 'react';

import AppBar from 'material-ui/AppBar';

import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
/* eslint-enable no-unused-vars */

const UnauthenticatedHomePage = (props) => {
  return (
    <div className='main-application__unauthed'>
      <div className='main-application__unauthed-navbar'>
          <AppBar
            iconElementLeft={<span></span>}
            style={{position: 'fixed', top: 0}}
            title='DocMan'
          />
      </div>
      <div className='main-application__content'>
        <div className='center row auth-container auth-container__margin-gt-sm'>
          <div className='col-xs-12 col-sm-12 auth-contents__margin-gt-sm auth-contents__margin-sm'>
            <div className='box center'>
              {props.auth.isShowingLogin
                ? <LoginPage {...props} />
                : <SignupPage {...props} />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

UnauthenticatedHomePage.propTypes = {
  onAuthAction: PropTypes.func.isRequired,
  onFieldUpdate: PropTypes.func.isRequired,
  toggleView: PropTypes.func.isRequired,
  auth: PropTypes.shape({
    isFetching: PropTypes.bool.isRequired,
    credentials: PropTypes.object.isRequired,
    isShowingLogin: PropTypes.bool.isRequired
  }).isRequired,
  errors: PropTypes.array
};

export default UnauthenticatedHomePage;

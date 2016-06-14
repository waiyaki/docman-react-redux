/* eslint-disable no-unused-vars */
import React, { PropTypes } from 'react';

import AppBar from 'material-ui/AppBar';

import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
/* eslint-enable no-unused-vars */

const UnauthenticatedHomePage = (props) => (
  <div className='auth-wrapper'>
    <div className='main-application__unauthed'>
      <div className='main-application__unauthed-navbar'>
        <AppBar
          iconElementLeft={<span></span>}
          style={{ position: 'fixed', top: 0 }}
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
        <div className='row center hide-sm-xs'>
          <div className='col-xs-12'>
            <div className='box landing'>
              <h1>DocMan</h1>
              <p className='first-p'>Share Your Thoughts With The World.</p>
              <p>
                With DocMan Document Manager, you can easily share what's on
                your mind with the world,
              </p>
              <p>
                while maintaining fine-grained control over who has access
                to the content you share.
              </p>
              <p>
                Give it a whirl by logging in or signing up using the text box
                to your right!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

UnauthenticatedHomePage.defaultProps = {
  auth: {
    isShowingLogin: true,
    isFetching: false,
    credentials: {},
    validations: {}
  }
};

UnauthenticatedHomePage.propTypes = {
  auth: PropTypes.shape({
    isFetching: PropTypes.bool.isRequired,
    credentials: PropTypes.object.isRequired,
    isShowingLogin: PropTypes.bool.isRequired
  }).isRequired,
  errors: PropTypes.array, // eslint-disable-line
  handleToggleView: PropTypes.func.isRequired,
  onAuthAction: PropTypes.func.isRequired,
  onFieldUpdate: PropTypes.func.isRequired
};

export default UnauthenticatedHomePage;

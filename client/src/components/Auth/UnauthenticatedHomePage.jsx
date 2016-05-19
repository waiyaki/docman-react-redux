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
          <AppBar zDepth={0} title='Authentication' iconElementLeft={<span></span>}></AppBar>
      </div>
      <div className='auth-container'>
        <div className='box center'>
          {props.showingLogin
            ? <LoginPage
              onAuthAction={props.onAuthAction}
              onFieldUpdate={props.onFieldUpdate}
              auth={props.auth}
              errors={props.errors}
              toggleView={props.toggleView}
            />
            : <SignupPage
              onAuthAction={props.onAuthAction}
              onFieldUpdate={props.onFieldUpdate}
              auth={props.auth}
              errors={props.errors}
              toggleView={props.toggleView}
            />
          }
        </div>
      </div>
    </div>
  );
};

UnauthenticatedHomePage.propTypes = {
  onAuthAction: PropTypes.func.isRequired,
  onFieldUpdate: PropTypes.func.isRequired,
  toggleView: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.array,
  showingLogin: PropTypes.bool.isRequired
};

export default UnauthenticatedHomePage;

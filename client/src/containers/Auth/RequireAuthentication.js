import React from 'react';
import {connect} from 'react-redux';
import {Map} from 'immutable';

import UnauthenticatedHomeContainer from './UnauthenticatedHomeContainer';

/**
 * Check whether a user is logged in using a Higher Order Component.
 * If the user is not logged in, render the UnauthenticatedHomeContainer,
 * otherwise, render the protected component.
 */
function RequireAuthentication (Component) {
  class AuthenticationRequired extends React.Component {
    render () {
      return this.props.auth.get('isAuthenticated')
        ? <Component {...this.props}/>
        : <UnauthenticatedHomeContainer />;
    }
  }

  AuthenticationRequired.propTypes = {
    auth: function (props, propName, componentName) {
      if (!props[propName] instanceof Map) {
        return new Error(
          `Invalid prop ${propName} supplied to ${componentName}.` +
          'Expected `Immutable.Map`'
        );
      }
    }
  };

  function mapStateToProps (state) {
    const auth = state.get('auth');
    return {
      auth
    };
  }

  return connect(mapStateToProps)(AuthenticationRequired);
}

export default RequireAuthentication;

import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import UnauthenticatedHomeContainer from './UnauthenticatedHomeContainer';

/**
 * Check whether a user is logged in using a Higher Order Component.
 * If the user is not logged in, render the UnauthenticatedHomeContainer,
 * otherwise, render the protected component.
 */
function RequireAuthentication(Component) {
  const AuthenticationRequired = (props) => {
    if (props.auth.get('isAuthenticated')) {
      return <Component {...props} />;
    }
    return <UnauthenticatedHomeContainer />;
  };

  AuthenticationRequired.propTypes = {
    auth: (props, propName, componentName) => {
      if (!props[propName] instanceof Map) {
        return new Error(
          `Invalid prop ${propName} supplied to ${componentName}.` +
          'Expected `Immutable.Map`'
        );
      }
      return undefined;
    }
  };

  function mapStateToProps(state) {
    const auth = state.get('auth');
    return {
      auth
    };
  }

  return connect(mapStateToProps)(AuthenticationRequired);
}

export default RequireAuthentication;

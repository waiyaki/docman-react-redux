/**
 * Action Creators.
 *
 * Returns functions that generate actions with types and optional data
 */
import * as actionTypes from '../constants';
import Axios from 'axios';

export function loginRequest (credentials) {
  return {
    type: actionTypes.LOGIN_REQUEST,
    isAuthenticated: false,
    isFetching: true,
    credentials
  };
}

export function loginSuccess (user) {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    isAuthenticated: true,
    isFetching: false,
    user
  };
}

export function loginFailure (error) {
  return {
    type: actionTypes.LOGIN_FAILURE,
    isAuthenticated: false,
    isFetching: false,
    error: error.data
  };
}

export function loginUser (credentials) {
  return function (dispatch) {
    // Announce to the application that we're performing login
    dispatch(loginRequest(credentials));

    return Axios
      .post('/api/users/login', {
        username: credentials.username,
        password: credentials.password
      })
      .then((user) => {
        dispatch(loginSuccess(user));
      })
      .catch((error) => {
        dispatch(loginFailure(error));
      });
  };
}

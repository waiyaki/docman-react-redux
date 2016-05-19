/**
 * Action Creators.
 *
 * Returns functions that generate actions with types and optional data
 */
import Axios from 'axios';

import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST } from '../constants';

export function loginRequest (credentials) {
  return {
    type: LOGIN_REQUEST,
    credentials
  };
}

export function loginSuccess (user) {
  return {
    type: LOGIN_SUCCESS,
    user: user.data
  };
}

export function loginFailure (error) {
  return {
    type: LOGIN_FAILURE,
    error: error.data
  };
}

export function loginUser (credentials) {
  return function (dispatch) {
    // Announce to the application that we're performing login
    dispatch(loginRequest(credentials));

    return Axios
      .post('/api/users/login', {credentials})
      .then((user) => {
        dispatch(loginSuccess(user));
      })
      .catch((error) => {
        dispatch(loginFailure(error));
      });
  };
}

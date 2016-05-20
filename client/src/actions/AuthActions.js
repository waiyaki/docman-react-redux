/**
 * Action Creators.
 *
 * Returns functions that generate auth actions with types and optional data
 */

import Axios from 'axios';

import {
  LOGIN_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST,
  SIGNUP_SUCCESS, SIGNUP_FAILURE, SIGNUP_REQUEST,
  CREDENTIALS_UPDATE, TOGGLE_LOGIN_VIEW
} from '../constants';

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
      .post('/api/users/login', credentials)
      .then((user) => {
        dispatch(loginSuccess(user));
      })
      .catch((error) => {
        dispatch(loginFailure(error));
      });
  };
}

export function requestSignup (credentials) {
  return {
    type: SIGNUP_REQUEST,
    credentials
  };
}

export function signupSuccess (user) {
  return {
    type: SIGNUP_SUCCESS,
    user: user.data
  };
}

export function signupFailure (error) {
  return {
    type: SIGNUP_FAILURE,
    error: error.data
  };
}

export function signupUser (credentials) {
  return function (dispatch) {
    // Announce that we're beginning signup.
    dispatch(requestSignup(credentials));

    return Axios
      .post('/api/users', credentials)
      .then((user) => dispatch(signupSuccess(user)))
      .catch((error) => dispatch(signupFailure(error)));
  };
}

export function credentialsUpdate (credentials) {
  return {
    type: CREDENTIALS_UPDATE,
    credentials
  };
}

export function toggleLoginView () {
  return {
    type: TOGGLE_LOGIN_VIEW
  };
}

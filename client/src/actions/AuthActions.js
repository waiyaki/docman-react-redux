/**
 * Action Creators.
 *
 * Returns functions that generate auth actions with types and optional data
 */

import Axios from 'axios';

import {
  LOGIN_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGOUT_REQUEST,
  SIGNUP_SUCCESS, SIGNUP_FAILURE, SIGNUP_REQUEST,
  CREDENTIALS_UPDATE, TOGGLE_LOGIN_VIEW
} from '../constants';

import { showSnackBarMessage } from './UtilityActions';
import { registerSockets, subscribeToUpdates } from './SocketsActions';
import { setAuthToken, removeAuthToken } from '../utils';

/* LOGIN ACTIONS */
export function loginRequest(credentials) {
  return {
    type: LOGIN_REQUEST,
    credentials
  };
}

export function loginSuccess(user) {
  return {
    type: LOGIN_SUCCESS,
    user: user.data
  };
}

export function loginFailure(error) {
  return {
    type: LOGIN_FAILURE,
    error: error.data || { message: error.message }
  };
}

export function loginUser(credentials) {
  return (dispatch) => {
    // Announce to the application that we're performing login
    dispatch(loginRequest(credentials));

    return Axios
      .post('/api/users/login', credentials)
      .then((user) => {
        setAuthToken(user.data.token);
        dispatch(loginSuccess(user));
        dispatch(showSnackBarMessage('Successfully logged in.'));
      })
      .catch((error) => {
        dispatch(loginFailure(error));
        dispatch(showSnackBarMessage('Oops! An error occurred.'));
      });
  };
}

/* LOGOUT ACTION */
export function performUserLogout() {
  return {
    type: LOGOUT_REQUEST
  };
}

export function logoutUser(message) {
  return (dispatch) => {
    removeAuthToken();
    dispatch(performUserLogout());

    // use message !== false to avoid failing if message === undefined
    if (message !== false) {
      dispatch(showSnackBarMessage('Successfully logged out.'));
    }
  };
}

/* REGISTRATION ACTIONS  */
export function requestSignup(credentials) {
  return {
    type: SIGNUP_REQUEST,
    credentials
  };
}

export function signupSuccess(user) {
  return {
    type: SIGNUP_SUCCESS,
    user: user.data
  };
}

export function signupFailure(error) {
  return {
    type: SIGNUP_FAILURE,
    error: error.data || { message: error.message }
  };
}

export function signupUser(credentials) {
  return (dispatch) => {
    // Announce that we're beginning signup.
    dispatch(requestSignup(credentials));

    return Axios
      .post('/api/users', credentials)
      .then((user) => {
        setAuthToken(user.data.token);
        dispatch(signupSuccess(user));
        dispatch(registerSockets());
        dispatch(subscribeToUpdates(user.data));
        dispatch(showSnackBarMessage("Yay! You've successfully registered!"));
      })
      .catch((error) => {
        dispatch(signupFailure(error));
        dispatch(showSnackBarMessage('Oops! An error occurred.'));
      });
  };
}

/* USER DETAILS ACTIONS */
export function credentialsUpdate(credentials) {
  return {
    type: CREDENTIALS_UPDATE,
    credentials
  };
}

/* MISCELLANEOUS ACTIONS */
export function toggleLoginView() {
  return {
    type: TOGGLE_LOGIN_VIEW
  };
}

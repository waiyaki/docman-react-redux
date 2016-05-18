/**
 * Action Creators.
 *
 * Returns functions that generate actions with types and optional data
 */
import * as actionTypes from '../constants';

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

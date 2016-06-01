import Axios from 'axios';

import * as actionTypes from '../constants';
import {logoutUser} from './AuthActions';
import {showSnackBarMessage} from './UtilityActions';

export function requestFetchUserDetails () {
  return {
    type: actionTypes.FETCH_USER_DETAILS_REQUEST
  };
}

export function fetchUserDetailsSuccess (user) {
  return {
    type: actionTypes.FETCH_USER_DETAILS_SUCCESS,
    user: user.data
  };
}

export function fetchUserDetailsError (error, authError = false) {
  return {
    type: actionTypes.FETCH_USER_DETAILS_ERROR,
    error: error.data || {message: error.message},
    authError
  };
}

/**
 * Load user details from the server.
 * Happens if there's a cached token in localStorage and we do not have details
 * about the currently logged in user.
 *
 * Called when a user comes back to the application acts as a means
 * of token validation.
 */
export function loadUserDetails () {
  let userToken = localStorage.getItem('token');

  if (!userToken) {
    return;
  }

  // Get User Payload from the base64 encoded token.
  let user = JSON.parse(window.atob(userToken.split('.')[1]));
  return function (dispatch) {
    dispatch(requestFetchUserDetails());

    return Axios
      .get(`/api/users/${user.username}`, {
        headers: {'x-access-token': userToken}
      })
      .then((user) => dispatch(fetchUserDetailsSuccess(user)))
      .catch((error) => {
        // If we get a 401 while fetching this user's details using the cached
        // token, that token is invalid. Log them out.
        if (error.status === 401) {
          dispatch(fetchUserDetailsError(error, true));
          dispatch(logoutUser(false));
        } else {
          dispatch(fetchUserDetailsError(error));
        }
      });
  };
}

export function requestUserDetailsUpdate (updatedUser) {
  return {
    type: actionTypes.USER_DETAILS_UPDATE_REQUEST,
    updatedUser
  };
}

export function userDetailsUpdateSuccess (updatedUser) {
  return {
    type: actionTypes.USER_DETAILS_UPDATE_SUCCESS,
    user: updatedUser.data
  };
}

export function userDetailsUpdateFailure (error) {
  return {
    type: actionTypes.USER_DETAILS_UPDATE_FAILURE,
    error: error.data || {message: error.message}
  };
}

export function updateUserDetails (userUpdate) {
  return (dispatch) => {
    dispatch(requestUserDetailsUpdate(userUpdate));

    return Axios
      .put(`/api/users/${userUpdate.username}`, userUpdate, {
        headers: {'x-access-token': window.localStorage.getItem('token')}
      })
      .then((updatedUser) => {
        dispatch(userDetailsUpdateSuccess(updatedUser));
        dispatch(showSnackBarMessage('Successfully updated profile.'));
      })
      .catch((error) => {
        dispatch(userDetailsUpdateFailure(error));
        dispatch(showSnackBarMessage('Oops! An error occurred.'));
      });
  };
}

export function userDetailsFieldUpdate (updatedUser) {
  return {
    type: actionTypes.USER_DETAILS_FIELD_UPDATE,
    updatedUser
  };
}
export function toggleShowUserUpdateView () {
  return {
    type: actionTypes.TOGGLE_SHOW_USER_UPDATE_VIEW
  };
}

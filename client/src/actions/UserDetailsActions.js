import Axios from 'axios';

import * as actionTypes from '../constants';
import {logoutUser} from './AuthActions';

export function requestFetchUserDetails () {
  return {
    type: actionTypes.FETCH_USER_DETAILS_REQUEST
  };
}

export function fetchUserDetails (user) {
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

export function loadUserDetails () {
  let userToken = localStorage.getItem('token');

  // Get User Payload from the base64 encoded token.
  let user = JSON.parse(window.atob(userToken.split('.')[1]));
  return function (dispatch) {
    dispatch(requestFetchUserDetails());

    return Axios
      .get(`/api/users/${user.username}`, {
        headers: {'x-access-token': userToken}
      })
      .then((user) => dispatch(fetchUserDetails(user)))
      .catch((error) => {
        // If we get a 401 while fetching this user's details using the cached
        // token, that token is invalid. Log them out.
        if (error.status === 401) {
          dispatch(fetchUserDetailsError(error, true));
          dispatch(logoutUser());
        } else {
          dispatch(fetchUserDetailsError(error));
        }
      });
  };
}

export function requestUserDetailsUpdate (userUpdate) {
  return {
    type: actionTypes.USER_DETAILS_UPDATE_REQUEST,
    userUpdate
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
      .put(`/api/users/${userUpdate.username}`, userUpdate)
      .then((updatedUser) => dispatch(userDetailsUpdateSuccess(updatedUser)))
      .catch((error) => dispatch(userDetailsUpdateFailure(error)));
  };
}

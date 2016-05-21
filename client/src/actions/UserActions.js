import Axios from 'axios';

import * as actionTypes from '../constants';

export function updateUserDetails (user) {
  return {
    type: actionTypes.UPDATE_USER_DETAILS,
    user: user.data
  };
}

export function updateUserDetailsError (error) {
  return {
    type: actionTypes.UPDATE_USER_DETAILS_ERROR,
    error: error.data || {message: error.message}
  };
}

export function loadUserDetails () {
  let userToken = localStorage.getItem('token');

  // Get User Payload from the base64 encoded token.
  let user = JSON.parse(window.atob(userToken.split('.')[1]));
  return function (dispatch) {
    return Axios
      .get(`/api/users/${user.username}`, {
        headers: {'x-access-token': userToken}
      })
      .then((user) => dispatch(updateUserDetails(user)))
      .catch((error) => dispatch(updateUserDetailsError(error)));
  };
}

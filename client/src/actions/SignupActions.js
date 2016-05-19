import Axios from 'axios';

import { SIGNUP_SUCCESS, SIGNUP_FAILURE, SIGNUP_REQUEST } from '../constants';

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

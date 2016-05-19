import { Map } from 'immutable';

import * as actionTypes from '../constants';

export default function (state = Map({
  isAuthenticated: !!localStorage.getItem('token'),
  isFetching: false,
  credentials: null,
  error: null,
  user: null
}), action) {
  switch (action.type) {
    case actionTypes.LOGIN_REQUEST:
    case actionTypes.SIGNUP_REQUEST:
      return state.merge(Map({
        isAuthenticated: false,
        isFetching: true,
        credentials: action.credentials,
        user: null,
        error: null
      }));

    case actionTypes.LOGIN_SUCCESS:
    case actionTypes.SIGNUP_SUCCESS:
      return state.merge(Map({
        isAuthenticated: true,
        isFetching: false,
        credentials: null,
        error: null,
        user: action.user
      }));

    case actionTypes.LOGIN_FAILURE:
    case actionTypes.SIGNUP_FAILURE:
      return state.merge(Map({
        isAuthenticated: false,
        isFetching: false,
        error: action.error,
        user: null
      }));
    default:
      return state;
  }
}

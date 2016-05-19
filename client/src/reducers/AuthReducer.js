import { Map } from 'immutable';

import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST } from '../constants';

export default function (state = Map({
  isAuthenticated: !!localStorage.getItem('token'),
  isFetching: false,
  credentials: null,
  error: null,
  user: null
}), action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return state.merge(Map({
        isAuthenticated: false,
        isFetching: true,
        credentials: action.credentials,
        user: null,
        error: null
      }));
    case LOGIN_SUCCESS:
      return state.merge(Map({
        isAuthenticated: true,
        isFetching: false,
        credentials: null,
        error: null,
        user: action.user
      }));
    case LOGIN_FAILURE:
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

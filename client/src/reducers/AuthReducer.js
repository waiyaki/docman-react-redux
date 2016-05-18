import { Map } from 'immutable';

import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST } from '../constants';

export default function (state = Map({
  auth: {
    isAuthenticated: !!localStorage.getItem('token'),
    isFetching: false
  }
}), action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return state.set('auth', Map({
        isAuthenticated: false,
        isFetching: true,
        credentials: action.credentials
      }));
    case LOGIN_SUCCESS:
      return state.set('auth', Map({
        isAuthenticated: true,
        isFetching: false,
        user: action.user
      }));
    case LOGIN_FAILURE:
      return state.set('auth', Map({
        isAuthenticated: false,
        isFetching: false,
        error: action.error
      }));
    default:
      return state;
  }
}

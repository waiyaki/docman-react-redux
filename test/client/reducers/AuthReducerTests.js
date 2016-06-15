import { Map, fromJS } from 'immutable';
import { expect } from 'chai';

import * as actionTypes from '../../../client/src/constants';

import authReducer, {
  INITIAL_AUTH_STATE
} from '../../../client/src/reducers/AuthReducer';

describe('Auth Reducer', () => {
  it('returns the initial state', () => {
    expect(authReducer(undefined, {})).to.eql(INITIAL_AUTH_STATE);
  });

  it('handles LOGIN_REQUEST', () => {
    const action = {
      type: actionTypes.LOGIN_REQUEST,
      credentials: {
        username: 'test',
        password: 'secret'
      }
    };

    expect(authReducer(Map(), action)).to.eql(Map({
      isFetching: true,
      credentials: fromJS(action.credentials)
    }));
  });

  it('handles SIGNUP_REQUEST', () => {
    const action = {
      type: actionTypes.SIGNUP_REQUEST,
      credentials: {
        username: 'test',
        password: 'secret'
      }
    };
    expect(authReducer(Map(), action)).to.eql(Map({
      isFetching: true,
      credentials: fromJS(action.credentials)
    }));
  });

  it('handles LOGIN_SUCCESS', () => {
    const action = {
      type: actionTypes.LOGIN_SUCCESS,
      user: {
        username: 'test'
      }
    };

    expect(authReducer(INITIAL_AUTH_STATE, action))
      .to.eql(INITIAL_AUTH_STATE.merge(Map({
        isAuthenticated: true,
        user: Map({
          username: 'test'
        })
      })));
  });

  it('handles SIGNUP_SUCCESS', () => {
    const action = {
      type: actionTypes.SIGNUP_SUCCESS,
      user: {
        username: 'test'
      }
    };

    expect(authReducer(INITIAL_AUTH_STATE, action))
      .to.eql(INITIAL_AUTH_STATE.merge(Map({
        isAuthenticated: true,
        user: Map({
          username: 'test'
        })
      })));
  });

  it('handles LOGIN_FAILURE', () => {
    const action = {
      type: actionTypes.LOGIN_FAILURE,
      error: 'Invalid credentials'
    };

    expect(authReducer(Map(), action)).to.eql(Map({
      isAuthenticated: false,
      isFetching: false,
      error: 'Invalid credentials',
      user: null
    }));
  });

  it('handles SIGNUP_FAILURE', () => {
    const action = {
      type: actionTypes.SIGNUP_FAILURE,
      error: 'Invalid credentials'
    };

    expect(authReducer(Map(), action)).to.eql(Map({
      isAuthenticated: false,
      isFetching: false,
      error: 'Invalid credentials',
      user: null
    }));
  });

  it('handles LOGOUT_REQUEST', () => {
    expect(authReducer(undefined, { type: actionTypes.LOGOUT_REQUEST }))
    .to.eql(INITIAL_AUTH_STATE.merge({
      isAuthenticated: false
    }));
  });

  it('handles CREDENTIALS_UPDATE', () => {
    const action = {
      type: actionTypes.CREDENTIALS_UPDATE,
      credentials: {
        username: 'test'
      }
    };

    expect(authReducer(Map(), action)).to.eql(Map({
      credentials: Map({
        username: 'test'
      })
    }));
  });

  it('handles VALIDATE_AUTH_FIELD', () => {
    const state = Map({
      credentials: Map({
        username: null
      }),
      validations: Map({
        isValid: true
      })
    });
    const action = {
      type: actionTypes.VALIDATE_AUTH_FIELD,
      field: 'username'
    };

    expect(authReducer(state, action)).to.eql(Map({
      credentials: Map({
        username: null
      }),
      validations: Map({
        username: 'This field is required.',
        isValid: false
      })
    }));
  });

  it('handles TOGGLE_LOGIN_VIEW', () => {
    const state = Map({
      isShowingLogin: false
    });
    const action = {
      type: actionTypes.TOGGLE_LOGIN_VIEW
    };

    expect(authReducer(state, action)).to.eql(Map({
      isShowingLogin: true,
      error: null,
      validations: Map({
        isValid: false
      })
    }));
  });

  it('handles FETCH_USER_DETAILS_SUCCESS', () => {
    const action = {
      type: actionTypes.FETCH_USER_DETAILS_SUCCESS,
      user: {
        username: 'test'
      }
    };

    expect(authReducer(Map(), action)).to.eql(Map({
      user: action.user
    }));
  });
});

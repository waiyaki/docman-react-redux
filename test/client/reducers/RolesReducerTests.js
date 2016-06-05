import {Map, List} from 'immutable';
import {expect} from 'chai';

import * as actionTypes from '../../../client/src/constants';

import RolesReducer, {
  INITIAL_ROLES_STATE
} from '../../../client/src/reducers/RolesReducer';

describe('Roles Reducer', () => {
  it('should return the initial state', () => {
    expect(RolesReducer(undefined, {})).to.eql(INITIAL_ROLES_STATE);
  });

  it('should handle FETCH_ROLES_REQUEST', () => {
    const state = Map();
    const action = {
      type: actionTypes.FETCH_ROLES_REQUEST
    };
    expect(RolesReducer(state, action)).to.eql(Map({isFetching: true}));
  });

  it('should handle FETCH_ROLES_SUCCESS', () => {
    const state = Map();
    const action = {
      type: actionTypes.FETCH_ROLES_SUCCESS,
      roles: 'these are some roles'.split()
    };

    expect(RolesReducer(state, action)).to.eql(Map({
      isFetching: false,
      roles: List(action.roles)
    }));
  });

  it('should handle FETCH_ROLES_FAILURE', () => {
    const state = Map();
    const action = {
      type: actionTypes.FETCH_ROLES_FAILURE,
      error: {
        message: 'Bad Request'
      }
    };

    expect(RolesReducer(state, action)).to.eql(Map({
      isFetching: false,
      rolesFetchError: Map({
        message: 'Bad Request'
      })
    }));
  });

  it('should handle LOGOUT_REQUEST', () => {
    const state = Map();
    const action = {
      type: actionTypes.LOGOUT_REQUEST
    };

    expect(RolesReducer(state, action)).to.eql(INITIAL_ROLES_STATE);
  });
});

import { Map, fromJS } from 'immutable';
import { expect } from 'chai';

import * as actionTypes from '../../../client/src/constants';

import userDetailsReducer, {
  INITIAL_USER_DETAILS_STATE
} from '../../../client/src/reducers/UserDetailsReducer';

describe('User Details Reducer', () => {
  it('should return the initial state', () => {
    expect(userDetailsReducer(undefined, {}))
      .to.eql(INITIAL_USER_DETAILS_STATE);
  });

  it('should handle FETCH_USER_DETAILS_REQUEST', () => {
    const state = Map();
    const action = {
      type: actionTypes.FETCH_USER_DETAILS_REQUEST
    };

    expect(userDetailsReducer(state, action)).to.eql(Map({
      isFetching: true
    }));
  });

  it('should handle FETCH_USER_DETAILS_SUCCESS', () => {
    const state = Map();
    const action = {
      type: actionTypes.FETCH_USER_DETAILS_SUCCESS,
      user: {
        username: 'test'
      }
    };

    expect(userDetailsReducer(state, action)).to.eql(Map({
      isFetching: false,
      user: Map({
        username: 'test'
      })
    }));
  });

  it('should handle FETCH_USER_DETAILS_ERROR without auth error', () => {
    const state = Map();
    const action = {
      type: actionTypes.FETCH_USER_DETAILS_ERROR,
      error: {
        message: 'That was unexpected.'
      }
    };

    expect(userDetailsReducer(state, action)).to.eql(Map({
      isFetching: false,
      fetchError: fromJS(action.error)
    }));
  });

  it('should handle FETCH_USER_DETAILS_ERROR with auth error', () => {
    const action = {
      type: actionTypes.FETCH_USER_DETAILS_ERROR,
      authError: true
    };

    expect(userDetailsReducer(Map(), action))
      .to.eql(INITIAL_USER_DETAILS_STATE);
  });

  it('should handle USER_DETAILS_UPDATE_REQUEST', () => {
    const state = Map();
    const action = {
      type: actionTypes.USER_DETAILS_UPDATE_REQUEST,
      updatedUser: {
        username: 'test2'
      }
    };

    expect(userDetailsReducer(state, action)).to.eql(Map({
      isFetching: true,
      updatedUser: fromJS(action.updatedUser)
    }));
  });

  it('should handle USER_DETAILS_UPDATE_SUCCESS', () => {
    const state = Map();
    const action = {
      type: actionTypes.USER_DETAILS_UPDATE_SUCCESS,
      user: {
        username: 'test'
      }
    };

    expect(userDetailsReducer(state, action)).to.eql(Map({
      isFetching: false,
      isShowingUpdate: false,
      updatedUser: fromJS(action.user),
      user: fromJS(action.user)
    }));
  });

  it('should handle USER_DETAILS_UPDATE_FAILURE', () => {
    const action = {
      type: actionTypes.USER_DETAILS_UPDATE_FAILURE,
      error: 'Meh'
    };

    expect(userDetailsReducer(Map(), action)).to.eql(Map({
      isFetching: false,
      userUpdateError: 'Meh'
    }));
  });

  it('should handle LOGOUT_REQUEST', () => {
    expect(userDetailsReducer(Map(), { type: actionTypes.LOGOUT_REQUEST }))
      .to.eql(INITIAL_USER_DETAILS_STATE);
  });

  it('should handle TOGGLE_SHOW_USER_UPDATE_VIEW', () => {
    const state = Map({
      isShowingUpdate: false
    });
    const action = {
      type: actionTypes.TOGGLE_SHOW_USER_UPDATE_VIEW
    };

    expect(userDetailsReducer(state, action)).to.eql(Map({
      isShowingUpdate: true,
      userUpdateError: null,
      validations: Map({
        isValid: false
      })
    }));
  });

  it('handles USER_DETAILS_FIELD_UPDATE', () => {
    const action = {
      type: actionTypes.USER_DETAILS_FIELD_UPDATE,
      updatedUser: {
        username: 'test',
        email: 'foo@bar.com'
      }
    };

    expect(userDetailsReducer(Map(), action)).to.eql(Map({
      updatedUser: fromJS(action.updatedUser)
    }));
  });

  it('handles VALIDATE_USER_DETAILS_FIELD', () => {
    const state = Map({
      updatedUser: Map({
        email: null
      }),
      validations: Map({
        isValid: true
      })
    });
    const action = {
      type: actionTypes.VALIDATE_USER_DETAILS_FIELD,
      field: 'email'
    };

    expect(userDetailsReducer(state, action)).to.eql(Map({
      updatedUser: Map({
        email: null
      }),
      validations: Map({
        email: 'This field is required.',
        isValid: false
      })
    }));
  });
});

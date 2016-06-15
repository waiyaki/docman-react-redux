import { Map, List } from 'immutable';
import { expect } from 'chai';

import * as actionTypes from '../../../client/src/constants';

import selectedUserReducer, {
  INITIAL_SELECTED_USER_STATE
} from '../../../client/src/reducers/SelectedUserReducer';

describe('Selected User Reducer', () => {
  it('should return the initial state', () => {
    expect(selectedUserReducer(undefined, {}))
      .to.eql(INITIAL_SELECTED_USER_STATE);
  });

  it('should handle FETCH_ANOTHER_USERS_PROFILE_REQUEST', () => {
    const action = {
      type: actionTypes.FETCH_ANOTHER_USERS_PROFILE_REQUEST,
      username: 'test'
    };

    expect(selectedUserReducer(Map(), action))
      .to.eql(INITIAL_SELECTED_USER_STATE.merge({ username: action.username }));
  });

  it('should handle FETCH_ANOTHER_USERS_PROFILE_SUCCESS', () => {
    const state = Map({
      profile: Map()
    });
    const action = {
      type: actionTypes.FETCH_ANOTHER_USERS_PROFILE_SUCCESS,
      profileData: {
        username: 'test'
      }
    };

    expect(selectedUserReducer(state, action)).to.eql(Map({
      profile: Map({
        isFetchingProfile: false,
        user: Map({
          username: 'test'
        })
      })
    }));
  });

  it('should handle FETCH_ANOTHER_USERS_PROFILE_FAILURE', () => {
    const state = Map({
      profile: Map()
    });
    const action = {
      type: actionTypes.FETCH_ANOTHER_USERS_PROFILE_FAILURE,
      error: {
        message: 'Uh oh'
      }
    };

    expect(selectedUserReducer(state, action)).to.eql(Map({
      profile: Map({
        isFetchingProfile: false,
        profileFetchError: Map({
          message: 'Uh oh'
        })
      })
    }));
  });

  it('should handle USER_DOCUMENTS_FETCH_REQUEST', () => {
    const state = Map({
      docs: Map()
    });
    const action = {
      type: actionTypes.USER_DOCUMENTS_FETCH_REQUEST
    };

    expect(selectedUserReducer(state, action)).to.eql(Map({
      docs: Map({
        isFetching: true
      })
    }));
  });

  it('should handle USER_DOCUMENTS_FETCH_SUCCESS', () => {
    const state = Map({
      docs: Map()
    });
    const action = {
      type: actionTypes.USER_DOCUMENTS_FETCH_SUCCESS,
      documents: 'Dummy dummy documents'.split()
    };

    expect(selectedUserReducer(state, action)).to.eql(Map({
      docs: Map({
        isFetching: false,
        documents: List(action.documents)
      })
    }));
  });

  it('should handle USER_DOCUMENTS_FETCH_FAILURE', () => {
    const state = Map({
      docs: Map()
    });
    const action = {
      type: actionTypes.USER_DOCUMENTS_FETCH_FAILURE,
      error: {
        message: 'Bad request'
      }
    };

    expect(selectedUserReducer(state, action)).to.eql(Map({
      docs: Map({
        isFetching: false,
        documentsFetchError: Map({
          message: 'Bad request'
        })
      })
    }));
  });
});

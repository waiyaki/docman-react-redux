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
        isFetching: false,
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
        isFetching: false,
        fetchError: Map({
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

  it('should handle USER_DETAILS_UPDATE_SUCCESS', () => {
    const state = Map({
      profile: Map({
        user: Map({
          _id: 1
        })
      })
    });

    const action = {
      type: actionTypes.USER_DETAILS_UPDATE_SUCCESS,
      user: {
        _id: 1,
        username: 'test'
      }
    };
    expect(selectedUserReducer(state, action)).to.eql(Map({
      profile: Map({
        user: Map({
          _id: 1,
          username: 'test'
        })
      })
    }));
  });

  it('should handle ANOTHER_USER_PROFILE_UPDATE_REQUEST', () => {
    const state = Map({
      profile: Map()
    });
    const action = {
      type: actionTypes.ANOTHER_USER_PROFILE_UPDATE_REQUEST,
      updatedUser: {
        username: 'test'
      }
    };

    const nextState = Map({
      profile: Map({
        isFetching: true,
        updatedUser: Map({
          username: 'test'
        })
      })
    });

    expect(selectedUserReducer(state, action)).to.eql(nextState);
  });

  it('should handle ANOTHER_USER_PROFILE_UPDATE_SUCCESS', () => {
    const state = Map({
      profile: Map()
    });

    const action = {
      type: actionTypes.ANOTHER_USER_PROFILE_UPDATE_SUCCESS,
      user: {
        username: 'test'
      }
    };

    const nextState = Map({
      profile: Map({
        isFetching: false,
        user: Map({
          username: 'test'
        }),
        updatedUser: Map({
          username: 'test'
        })
      })
    });

    expect(selectedUserReducer(state, action)).to.eql(nextState);
  });

  it('should handle ANOTHER_USER_PROFILE_UPDATE_FAILURE', () => {
    const state = Map({
      profile: Map()
    });

    const action = {
      type: actionTypes.ANOTHER_USER_PROFILE_UPDATE_FAILURE,
      error: {
        message: 'that failed.'
      }
    };

    const nextState = Map({
      profile: Map({
        isFetching: false,
        profileFetchError: Map({
          message: 'that failed.'
        })
      })
    });

    expect(selectedUserReducer(state, action)).to.eql(nextState);
  });

  it('should handle ANOTHER_USER_DETAILS_FIELD_UPDATE', () => {
    const state = Map({
      profile: Map()
    });

    const action = {
      type: actionTypes.ANOTHER_USER_DETAILS_FIELD_UPDATE,
      updatedUser: {
        username: 'test'
      }
    };

    const nextState = Map({
      profile: Map({
        updatedUser: Map({
          username: 'test'
        })
      })
    });

    expect(selectedUserReducer(state, action)).to.eql(nextState);
  });

  it('should handle VALIDATE_ANOTHER_USER_DETAILS_FIELD', () => {
    const state = Map({
      profile: Map({
        updatedUser: Map({
          username: null
        })
      })
    });

    const action = {
      type: actionTypes.VALIDATE_ANOTHER_USER_DETAILS_FIELD,
      field: 'username'
    };

    const nextState = Map({
      profile: Map({
        updatedUser: Map({
          username: null
        }),
        validations: Map({
          isValid: false,
          username: 'This field is required.'
        })
      })
    });

    expect(selectedUserReducer(state, action)).to.eql(nextState);
  });
});

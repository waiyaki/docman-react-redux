import Axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import { Map } from 'immutable';

import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as actionTypes from '../../../client/src/constants';
/* eslint-disable no-duplicate-imports,import/no-duplicates */
import * as userActions from '../../../client/src/actions/UserDetailsActions';
import {
  __RewireAPI__ as userActionsRewireAPI
} from '../../../client/src/actions/UserDetailsActions';
/* eslint-enable no-duplicate-imports,import/no-duplicates */

const TOKEN = 'test.auth.token';

// Set up mocks for async actions
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

// Mock an axios instance to use in the tests and then rewire the imported
// modules to use the instance with the mocked handler. Also rewire
// `getAuthToken` to avoid accessing `window.localStorage`.
const axiosInstance = Axios.create();
const mockAxios = new AxiosMockAdapter(axiosInstance);
userActionsRewireAPI.__Rewire__('Axios', axiosInstance);
userActionsRewireAPI.__Rewire__('getAuthToken', () => TOKEN);

describe('UserDetailsActions', () => {
  const userData = {
    username: 'test',
    email: 'test@test.com',
    role: {
      title: 'user'
    }
  };

  it('create a FETCH_USER_DETAILS_REQUEST action', () => {
    const expectedAction = [{
      type: actionTypes.FETCH_USER_DETAILS_REQUEST
    }];
    const store = mockStore();
    store.dispatch(userActions.requestFetchUserDetails());
    expect(store.getActions()).to.eql(expectedAction);
  });

  it('create a FETCH_USER_DETAILS_SUCCESS action with user data', () => {
    const expectedAction = [{
      type: actionTypes.FETCH_USER_DETAILS_SUCCESS,
      user: userData
    }];
    const store = mockStore();
    store.dispatch(userActions.fetchUserDetailsSuccess({ data: userData }));
    expect(store.getActions()).to.eql(expectedAction);
  });

  it('create a FETCH_USER_DETAILS_ERROR action with error data', () => {
    const error = {
      message: 'Something failed.'
    };
    const expectedAction = [{
      type: actionTypes.FETCH_USER_DETAILS_ERROR,
      authError: false,
      error
    }];

    const store = mockStore();
    store.dispatch(userActions.fetchUserDetailsError(error));
    expect(store.getActions()).to.eql(expectedAction);
  });

  it('create a FETCH_USER_DETAILS_ERROR action with auth error', () => {
    const error = {
      message: 'Something failed.'
    };
    const expectedAction = [{
      type: actionTypes.FETCH_USER_DETAILS_ERROR,
      authError: true,
      error
    }];

    const store = mockStore();
    store.dispatch(userActions.fetchUserDetailsError(error, true));
    expect(store.getActions()).to.eql(expectedAction);
  });

  it('correctly handles errors from Axios', () => {
    const error = {
      data: {
        message: 'Something failed.'
      }
    };
    const expectedAction = [{
      type: actionTypes.FETCH_USER_DETAILS_ERROR,
      authError: false,
      error: error.data
    }];

    const store = mockStore();
    store.dispatch(userActions.fetchUserDetailsError(error));
    expect(store.getActions()).to.eql(expectedAction);
  });

  describe('.loadUserDetails()', () => {
    before(() => {
      userActionsRewireAPI.__Rewire__('parseUserFromToken', () => userData);
    });

    after(() => {
      userActionsRewireAPI.__ResetDependency__('parseUserFromToken');
    });

    afterEach(() => {
      mockAxios.reset();
    });

    it('creates FETCH_USER_DETAILS_REQUEST, FETCH_USER_DETAILS_SUCCESS and ' +
      'WEBSOCKET_UPDATES_SUBSCRIPTION actions on loadUserDetails success',
      () => {
        mockAxios
          .onGet(/api\/users\/.*/)
          .reply(200, userData);

        const expectedActions = [{
          type: actionTypes.FETCH_USER_DETAILS_REQUEST
        }, {
          type: actionTypes.FETCH_USER_DETAILS_SUCCESS,
          user: userData
        }, {
          type: actionTypes.WEBSOCKET_UPDATES_SUBSCRIPTION
        }];

        const getState = () => Map({
          auth: Map({
            user: {
              _id: 123
            }
          })
        });
        const store = mockStore(getState);

        return store.dispatch(userActions.loadUserDetails())
          .then(() => {
            expect(store.getActions()).to.eql(expectedActions);
          });
      });

    it('creates LOGOUT_REQUEST if no authToken is provided', () => {
      mockAxios
        .onGet(`/api/users/${userData.username}`)
        .reply(200, userData);

      const expectedAction = [{
        type: actionTypes.LOGOUT_REQUEST
      }];

      const store = mockStore();
      store.dispatch(userActions.loadUserDetails(null));
      expect(store.getActions()).to.eql(expectedAction);
    });

    it('creates FETCH_USER_DETAILS_ERROR and LOGOUT_REQUEST actions if ' +
      'server responds with a 401',
      () => {
        const error = {
          data: {
            message: 'Unauthorized.'
          }
        };

        mockAxios
          .onGet(/api\/users\/.*/)
          .reply(401, error.data);

        const expectedActions = [{
          type: actionTypes.FETCH_USER_DETAILS_REQUEST
        }, {
          type: actionTypes.FETCH_USER_DETAILS_ERROR,
          authError: true,
          error: error.data
        }, {
          type: actionTypes.LOGOUT_REQUEST
        }];

        const store = mockStore();
        return store.dispatch(userActions.loadUserDetails())
          .then(() => {
            expect(store.getActions()).to.eql(expectedActions);
          });
      });

    it('creates FETCH_USER_DETAILS_ERROR on fetch user details failure', () => {
      const error = {
        data: {
          message: 'Bad Request.'
        }
      };

      mockAxios
        .onGet(/api\/users\/.*/)
        .reply(400, error.data);

      const expectedActions = [{
        type: actionTypes.FETCH_USER_DETAILS_REQUEST
      }, {
        type: actionTypes.FETCH_USER_DETAILS_ERROR,
        authError: false,
        error: error.data
      }];

      const store = mockStore();
      return store.dispatch(userActions.loadUserDetails())
        .then(() => {
          expect(store.getActions()).to.eql(expectedActions);
        });
    });
  });

  it('create a USER_DETAILS_UPDATE_REQUEST action', () => {
    const expectedAction = [{
      type: actionTypes.USER_DETAILS_UPDATE_REQUEST,
      updatedUser: userData
    }];
    const store = mockStore();
    store.dispatch(userActions.requestUserDetailsUpdate(userData));
    expect(store.getActions()).to.eql(expectedAction);
  });

  it('create a USER_DETAILS_UPDATE_SUCCESS action', () => {
    const expectedAction = [{
      type: actionTypes.USER_DETAILS_UPDATE_SUCCESS,
      user: userData
    }];
    const store = mockStore();
    store.dispatch(userActions.userDetailsUpdateSuccess({ data: userData }));
    expect(store.getActions()).to.eql(expectedAction);
  });

  it('create a USER_DETAILS_UPDATE_FAILURE action', () => {
    const error = {
      message: 'Something went wrong.'
    };
    const expectedAction = [{
      type: actionTypes.USER_DETAILS_UPDATE_FAILURE,
      error
    }];
    const store = mockStore();
    store.dispatch(userActions.userDetailsUpdateFailure(error));
    expect(store.getActions()).to.eql(expectedAction);
  });

  describe('.updateUserDetails()', () => {
    const getState = () => Map({
      auth: Map({
        user: Map({
          _id: 'testID123'
        })
      })
    });

    afterEach(() => {
      mockAxios.reset();
    });

    it('creates user update request, success and snackbar message actions',
      () => {
        const updatedUser = Object.assign({}, userData, {
          updated: true
        });
        mockAxios
          .onPut(/api\/users\/.*/)
          .reply(200, updatedUser);
        mockAxios
          .onGet('/api/documents')
          .reply(200, []);

        const expectedActions = [{
          type: actionTypes.USER_DETAILS_UPDATE_REQUEST,
          updatedUser
        }, {
          type: actionTypes.FETCH_DOCUMENTS_REQUEST
        }, {
          type: actionTypes.USER_DETAILS_UPDATE_SUCCESS,
          user: updatedUser
        }, {
          type: actionTypes.SHOW_SNACKBAR_MESSAGE,
          message: 'Successfully updated profile.'
        }];

        const store = mockStore(() => Map({
          auth: Map({
            user: {
              _id: 123,
              role: Map({
                title: 'user'
              })
            }
          })
        }));
        return store.dispatch(userActions.updateUserDetails(updatedUser))
          .then(() => {
            expect(store.getActions()).to.eql(expectedActions);
          });
      });

    it('creates update request, update failure and snackbar message actions if update fails',
      () => {
        const updatedUser = Object.assign({}, userData, {
          updated: true
        });
        const error = {
          message: 'Bad Request.'
        };
        mockAxios
          .onPut('/api/users/testID123')
          .reply(400, error);

        const expectedActions = [{
          type: actionTypes.USER_DETAILS_UPDATE_REQUEST,
          updatedUser
        }, {
          type: actionTypes.USER_DETAILS_UPDATE_FAILURE,
          error
        }, {
          type: actionTypes.SHOW_SNACKBAR_MESSAGE,
          message: 'Oops! An error occurred.'
        }];

        const store = mockStore(getState);
        return store.dispatch(userActions.updateUserDetails(updatedUser))
          .then(() => {
            expect(store.getActions()).to.eql(expectedActions);
          });
      });
  });

  it('create an action for user detail input fields updates', () => {
    const expectedAction = [{
      type: actionTypes.USER_DETAILS_FIELD_UPDATE,
      updatedUser: userData
    }];
    const store = mockStore();
    store.dispatch(userActions.userDetailsFieldUpdate(userData));
    expect(store.getActions()).to.eql(expectedAction);
  });

  it('create an action for toggling user details update view', () => {
    const expectedAction = [{
      type: actionTypes.TOGGLE_SHOW_USER_UPDATE_VIEW
    }];
    const store = mockStore();
    store.dispatch(userActions.toggleShowUserUpdateView());
    expect(store.getActions()).to.eql(expectedAction);
  });

  it('create USER_DOCUMENTS_FETCH_REQUEST action', () => {
    const expectedAction = [{
      type: actionTypes.USER_DOCUMENTS_FETCH_REQUEST
    }];
    const store = mockStore();
    store.dispatch(userActions.requestFetchUserDocuments());
    expect(store.getActions()).to.eql(expectedAction);
  });

  it('create USER_DOCUMENTS_FETCH_SUCCESS action with documents', () => {
    const documents = ['this', 'that'];
    const expectedAction = [{
      type: actionTypes.USER_DOCUMENTS_FETCH_SUCCESS,
      documents
    }];
    const store = mockStore();
    store.dispatch(userActions.userDocumentsFetchSuccess({ data: documents }));
    expect(store.getActions()).to.eql(expectedAction);
  });

  it('create a USER_DOCUMENTS_FETCH_FAILURE action', () => {
    const error = {
      message: 'Something went wrong.'
    };
    const expectedAction = [{
      type: actionTypes.USER_DOCUMENTS_FETCH_FAILURE,
      error
    }];
    const store = mockStore();
    store.dispatch(userActions.userDocumentsFetchFailure(error));
    expect(store.getActions()).to.eql(expectedAction);
  });

  describe('.fetchUserDocuments()', () => {
    afterEach(() => {
      mockAxios.reset();
    });

    it('creates user documents request and fetch success actions', () => {
      const documents = 'this is a list of dummy thingys'.split();

      mockAxios
        .onGet(`/api/users/${userData.username}/documents`)
        .reply(200, documents);

      const expectedActions = [{
        type: actionTypes.USER_DOCUMENTS_FETCH_REQUEST
      }, {
        type: actionTypes.USER_DOCUMENTS_FETCH_SUCCESS,
        documents
      }];

      const store = mockStore();
      return store.dispatch(userActions.fetchUserDocuments(userData.username))
        .then(() => {
          expect(store.getActions()).to.eql(expectedActions);
        });
    });

    it('creates user documents request, fetch documents failure and show ' +
       'snackbar message actions if fetching documents fails', () => {
      const error = {
        message: 'Something failed.'
      };

      mockAxios
        .onGet(`/api/users/${userData.username}/documents`)
        .reply(400, error);

      const expectedActions = [{
        type: actionTypes.USER_DOCUMENTS_FETCH_REQUEST
      }, {
        type: actionTypes.USER_DOCUMENTS_FETCH_FAILURE,
        error
      }, {
        type: actionTypes.SHOW_SNACKBAR_MESSAGE,
        message: `Error getting ${userData.username}'s documents.`
      }];

      const store = mockStore();
      return store.dispatch(userActions.fetchUserDocuments(userData.username))
        .then(() => {
          expect(store.getActions()).to.eql(expectedActions);
        });
    });
  });

  it('create FETCH_ANOTHER_USERS_PROFILE_REQUEST action', () => {
    const expectedAction = [{
      type: actionTypes.FETCH_ANOTHER_USERS_PROFILE_REQUEST,
      username: userData.username
    }];
    const store = mockStore();
    store.dispatch(
      userActions.fetchAnotherUsersProfileRequest(userData.username));
    expect(store.getActions()).to.eql(expectedAction);
  });

  it('create FETCH_ANOTHER_USERS_PROFILE_SUCCESS action', () => {
    const profileData = Object.assign({}, userData, {
      isDifferent: true
    });

    const expectedAction = [{
      type: actionTypes.FETCH_ANOTHER_USERS_PROFILE_SUCCESS,
      profileData
    }];
    const store = mockStore();
    store.dispatch(
      userActions.fetchAnotherUsersProfileSuccess({ data: profileData }));
    expect(store.getActions()).to.eql(expectedAction);
  });

  it('create a FETCH_ANOTHER_USERS_PROFILE_FAILURE action', () => {
    const error = {
      message: 'Something went wrong.'
    };
    const expectedAction = [{
      type: actionTypes.FETCH_ANOTHER_USERS_PROFILE_FAILURE,
      error
    }];
    const store = mockStore();
    store.dispatch(userActions.fetchAnotherUsersProfileFailure(error));
    expect(store.getActions()).to.eql(expectedAction);
  });

  describe('.fetchAnotherUsersProfile()', () => {
    afterEach(() => {
      mockAxios.reset();
    });

    it('creates user profile fetch request and fetch success actions', () => {
      const profileData = Object.assign({}, userData, {
        isDifferent: true
      });

      mockAxios
        .onGet(`/api/users/${userData.username}`)
        .reply(200, profileData);

      const expectedActions = [{
        type: actionTypes.FETCH_ANOTHER_USERS_PROFILE_REQUEST,
        username: userData.username
      }, {
        type: actionTypes.FETCH_ANOTHER_USERS_PROFILE_SUCCESS,
        profileData
      }];

      const store = mockStore();
      return store.dispatch(
        userActions.fetchAnotherUsersProfile(userData.username))
          .then(() => {
            expect(store.getActions()).to.eql(expectedActions);
          });
    });

    it('creates user profile request, failure and snackbar actions', () => {
      const error = {
        message: 'Something failed.'
      };

      mockAxios
        .onGet(`/api/users/${userData.username}`)
        .reply(400, error);

      const expectedActions = [{
        type: actionTypes.FETCH_ANOTHER_USERS_PROFILE_REQUEST,
        username: userData.username
      }, {
        type: actionTypes.FETCH_ANOTHER_USERS_PROFILE_FAILURE,
        error
      }, {
        type: actionTypes.SHOW_SNACKBAR_MESSAGE,
        message: `Error fetching ${userData.username}'s profile`
      }];

      const store = mockStore();
      return store.dispatch(
        userActions.fetchAnotherUsersProfile(userData.username))
          .then(() => {
            expect(store.getActions()).to.eql(expectedActions);
          });
    });
  });

  describe('.updateAnotherUsersProfile()', () => {
    const updatedUser = {
      username: 'test updated',
      _id: 1
    };

    const getState = () => Map({
      selectedUser: Map({
        profile: Map({
          user: Map({
            _id: 1,
            username: 'test'
          })
        })
      })
    });

    afterEach(() => {
      mockAxios.reset();
    });

    it('creates ANOTHER_USER_PROFILE_UPDATE_REQUEST, ' +
      'ANOTHER_USER_PROFILE_UPDATE_SUCCESS and SHOW_SNACKBAR_MESSAGE ' +
      'on success', () => {
      mockAxios
        .onPut(/api\/users\/.*/)
        .reply(200, updatedUser);

      const expectedActions = [{
        type: actionTypes.ANOTHER_USER_PROFILE_UPDATE_REQUEST,
        updatedUser
      }, {
        type: actionTypes.ANOTHER_USER_PROFILE_UPDATE_SUCCESS,
        user: updatedUser
      }, {
        type: actionTypes.SHOW_SNACKBAR_MESSAGE,
        message: "test's profile update successful."
      }];

      const store = mockStore(getState);
      return store
        .dispatch(userActions.updateAnotherUsersProfile(updatedUser))
        .then(() => {
          expect(store.getActions()).to.eql(expectedActions);
        });
    });

    it('creates ANOTHER_USER_PROFILE_UPDATE_REQUEST, ' +
      'ANOTHER_USER_PROFILE_UPDATE_FAILURE and SHOW_SNACKBAR_MESSAGE ' +
      'on success', () => {
      const error = {
        message: 'That failed.'
      };

      mockAxios
        .onPut(/api\/users\/.*/)
        .reply(400, error);

      const expectedActions = [{
        type: actionTypes.ANOTHER_USER_PROFILE_UPDATE_REQUEST,
        updatedUser
      }, {
        type: actionTypes.ANOTHER_USER_PROFILE_UPDATE_FAILURE,
        error
      }, {
        type: actionTypes.SHOW_SNACKBAR_MESSAGE,
        message: "Error updating test's profile"
      }];

      const store = mockStore(getState);
      return store
        .dispatch(userActions.updateAnotherUsersProfile(updatedUser))
        .then(() => {
          expect(store.getActions()).to.eql(expectedActions);
        });
    });
  });
});

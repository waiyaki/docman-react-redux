import Axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import {Map} from 'immutable';
import {expect} from 'chai';

import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as authActions from '../../../client/src/actions/AuthActions';
// eslint-disable-next-line
import {
  __RewireAPI__ as authActionsRewireAPI
} from '../../../client/src/actions/AuthActions';

import * as actionTypes from '../../../client/src/constants';

// Set up mocks for async actions
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

// Mock an axios instance to use in the tests and then rewire the imported
// modules to use the instance with the mocked handler. Also rewire
// `setAuthToken` to avoid accessing `window.localStorage`.
let axiosInstance = Axios.create();
const mockAxios = new AxiosMockAdapter(axiosInstance);
authActionsRewireAPI.__Rewire__('Axios', axiosInstance);
authActionsRewireAPI.__Rewire__('setAuthToken', () => {});
authActionsRewireAPI.__Rewire__('removeAuthToken', () => {});

describe('AuthActions', () => {
  const credentials = { // Can double up as user data 😄
    username: 'test',
    password: 'testPassword'
  };

  it('create a LOGIN_REQUEST action with credentials', () => {
    const expectedAction = {
      type: actionTypes.LOGIN_REQUEST,
      credentials
    };

    expect(authActions.loginRequest(credentials)).to.eql(expectedAction);
  });

  it('create a LOGIN_SUCCESS action with user data', () => {
    const expectedAction = {
      type: actionTypes.LOGIN_SUCCESS,
      user: credentials
    };

    expect(authActions.loginSuccess({data: credentials}))
      .to.eql(expectedAction);
  });

  it('create a LOGIN_FAILURE action with an error message', () => {
    const error = {
      message: 'Something failed'
    };

    const expectedAction = {
      type: actionTypes.LOGIN_FAILURE,
      error
    };

    expect(authActions.loginFailure(error)).to.eql(expectedAction);
  });

  describe('.loginUser()', () => {
    afterEach(() => {
      mockAxios.reset();
    });

    it('creates LOGIN_REQUEST, LOGIN_SUCCESS and SHOW_SNACKBAR_MESSAGE actions on login success', () => {
      mockAxios
        .onPost('/api/users/login')
        .reply(200, credentials);

      const expectedActions = [{
        type: actionTypes.LOGIN_REQUEST,
        credentials
      }, {
        type: actionTypes.LOGIN_SUCCESS,
        user: credentials
      }, {
        type: actionTypes.SHOW_SNACKBAR_MESSAGE,
        message: 'Successfully logged in.'
      }];

      const store = mockStore();

      return store.dispatch(authActions.loginUser(credentials))
        .then(() => {
          expect(store.getActions()).to.eql(expectedActions);
        });
    });

    it('creates LOGIN_REQUEST, LOGIN_FAILURE and SHOW_SNACKBAR_MESSAGE actions if login fails', () => {
      const error = new Error('Invalid credentials');
      mockAxios
        .onPost('/api/users/login')
        .reply(401, error);

      const expectedActions = [{
        type: actionTypes.LOGIN_REQUEST,
        credentials
      }, {
        type: actionTypes.LOGIN_FAILURE,
        error: error
      }, {
        type: actionTypes.SHOW_SNACKBAR_MESSAGE,
        message: 'Oops! An error occurred.'
      }];

      const store = mockStore();

      return store.dispatch(authActions.loginUser(credentials))
        .then(() => {
          expect(store.getActions()).to.eql(expectedActions);
        });
    });
  });

  it('create a LOGOUT_REQUEST action on logout', () => {
    const expectedActions = [{
      type: actionTypes.LOGOUT_REQUEST
    }, {
      type: actionTypes.SHOW_SNACKBAR_MESSAGE,
      message: 'Successfully logged out.'
    }];

    const store = mockStore();
    store.dispatch(authActions.logoutUser());
    expect(store.getActions()).to.eql(expectedActions);
  });

  it("doesn't show snackbar message on logout if disabled", () => {
    const expectedActions = [{
      type: actionTypes.LOGOUT_REQUEST
    }];

    const store = mockStore();
    store.dispatch(authActions.logoutUser(false));
    expect(store.getActions()).to.eql(expectedActions);
  });

  it('create a SIGNUP_REQUEST action with credentials', () => {
    const expectedAction = {
      type: actionTypes.SIGNUP_REQUEST,
      credentials
    };

    expect(authActions.requestSignup(credentials)).to.eql(expectedAction);
  });

  it('create a SIGNUP_SUCCESS action with user data', () => {
    const expectedAction = {
      type: actionTypes.SIGNUP_SUCCESS,
      user: credentials
    };

    expect(authActions.signupSuccess({data: credentials}))
      .to.eql(expectedAction);
  });

  it('create a SIGNUP_FAILURE action with an error message', () => {
    const error = {
      message: 'Something failed'
    };

    const expectedAction = {
      type: actionTypes.SIGNUP_FAILURE,
      error
    };

    expect(authActions.signupFailure(error)).to.eql(expectedAction);
  });

  describe('.signupUser()', () => {
    afterEach(() => {
      mockAxios.reset();
    });

    it('creates SIGNUP_REQUEST, SIGNUP_SUCCESS, SHOW_SNACKBAR_MESSAGE and ' +
        'WEBSOCKET_UPDATES_SUBSCRIPTION actions if signup succeeds', () => {
      const userDetails = Object.assign({}, credentials, {
        role: {
          title: 'public'
        }
      });

      mockAxios
        .onPost('/api/users')
        .reply(200, userDetails);

      const expectedActions = [{
        type: actionTypes.SIGNUP_REQUEST,
        credentials
      }, {
        type: actionTypes.SIGNUP_SUCCESS,
        user: userDetails
      }, {
        type: actionTypes.WEBSOCKET_UPDATES_SUBSCRIPTION
      }, {
        type: actionTypes.SHOW_SNACKBAR_MESSAGE,
        message: "Yay! You've successfully registered!"
      }];

      const getState = () => Map({
        auth: Map({
          user: {
            _id: 123
          }
        })
      });
      const store = mockStore(getState);
      return store.dispatch(authActions.signupUser(credentials))
        .then(() => {
          expect(store.getActions()).to.eql(expectedActions);
        });
    });

    it('creates SIGNUP_REQUEST, SIGNUP_FAILURE and SHOW_SNACKBAR_MESSAGE actions if login fails', () => {
      const error = new Error('Invalid credentials');
      mockAxios
        .onPost('/api/users')
        .reply(401, error);

      const expectedActions = [{
        type: actionTypes.SIGNUP_REQUEST,
        credentials
      }, {
        type: actionTypes.SIGNUP_FAILURE,
        error
      }, {
        type: actionTypes.SHOW_SNACKBAR_MESSAGE,
        message: 'Oops! An error occurred.'
      }];

      const store = mockStore();

      return store.dispatch(authActions.signupUser(credentials))
        .then(() => {
          expect(store.getActions()).to.eql(expectedActions);
        });
    });
  });

  it('create a CREDENTIALS_UPDATE action with new credentials', () => {
    const expectedAction = {
      type: actionTypes.CREDENTIALS_UPDATE,
      credentials
    };

    expect(authActions.credentialsUpdate(credentials)).to.eql(expectedAction);
  });

  it('create a TOGGLE_LOGIN_VIEW action', () => {
    const expectedAction = {
      type: actionTypes.TOGGLE_LOGIN_VIEW
    };

    expect(authActions.toggleLoginView(credentials)).to.eql(expectedAction);
  });
});

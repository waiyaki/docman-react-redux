import { Map, fromJS } from 'immutable';

import * as actionTypes from '../constants';
import AuthFieldsValidationReducer from './AuthFieldsValidationReducer';

const INITIAL_AUTH_STATE = Map({
  isAuthenticated: !!localStorage.getItem('token'),
  isFetching: false,
  credentials: Map({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  }),
  error: null,
  user: null,
  isShowingLogin: true,
  validations: Map({
    isValid: false
  })
});

export default function (state = INITIAL_AUTH_STATE, action) {
  switch (action.type) {
    case actionTypes.LOGIN_REQUEST:
    case actionTypes.SIGNUP_REQUEST:
      return state.merge(Map({
        isFetching: true,
        credentials: fromJS(action.credentials)
      }));

    case actionTypes.LOGIN_SUCCESS:
    case actionTypes.SIGNUP_SUCCESS:
      return state.merge(Map({
        isAuthenticated: true,
        isFetching: false,
        credentials: Map({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        }),
        error: null,
        user: fromJS(action.user)
      }));

    case actionTypes.LOGIN_FAILURE:
    case actionTypes.SIGNUP_FAILURE:
      return state.merge(Map({
        isAuthenticated: false,
        isFetching: false,
        error: fromJS(action.error),
        user: null
      }));

    case actionTypes.LOGOUT_REQUEST:
      return INITIAL_AUTH_STATE.merge(fromJS({
        isAuthenticated: false
      }));

    case actionTypes.CREDENTIALS_UPDATE:
      return state.merge(Map({
        credentials: fromJS(action.credentials)
      }));

    case actionTypes.TOGGLE_LOGIN_VIEW:
      return state.merge(Map({
        isShowingLogin: !state.get('isShowingLogin'),
        error: null,
        validations: Map({
          isValid: false
        })
      }));

    case actionTypes.VALIDATE_FIELD:
      return state.merge(AuthFieldsValidationReducer(state, {
        type: action.field
      }));

    case actionTypes.FETCH_USER_DETAILS_SUCCESS:
      return state.merge(Map({
        user: action.user
      }));

    default:
      return state;
  }
}

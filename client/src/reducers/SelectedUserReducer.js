import { List, Map, fromJS } from 'immutable';

import * as actionTypes from '../constants';
import fieldsValidationReducer from './FieldsValidationReducer';

export const INITIAL_SELECTED_USER_STATE = Map({
  docs: Map({
    isFetching: false,
    documents: List(),
    documentsFetchError: Map()
  }),
  profile: Map({
    isFetching: true,
    profileFetchError: Map(),
    user: Map(),
    updatedUser: Map(),
    validations: Map()
  }),
  username: ''
});

export default function (state = INITIAL_SELECTED_USER_STATE, action) {
  switch (action.type) {
    case actionTypes.FETCH_ANOTHER_USERS_PROFILE_REQUEST:
      return INITIAL_SELECTED_USER_STATE.merge(Map({
        username: action.username
      }));

    case actionTypes.FETCH_ANOTHER_USERS_PROFILE_SUCCESS:
      return state.mergeIn(['profile'], Map({
        isFetching: false,
        user: fromJS(action.profileData)
      }));

    case actionTypes.FETCH_ANOTHER_USERS_PROFILE_FAILURE:
      return state.mergeIn(['profile'], Map({
        isFetching: false,
        profileFetchError: fromJS(action.error)
      }));

    case actionTypes.USER_DOCUMENTS_FETCH_REQUEST:
      return state.mergeIn(['docs'], Map({
        isFetching: true
      }));

    case actionTypes.USER_DOCUMENTS_FETCH_SUCCESS:
      return state.mergeIn(['docs'], Map({
        isFetching: false,
        documents: fromJS(action.documents)
      }));

    case actionTypes.USER_DOCUMENTS_FETCH_FAILURE:
      return state.mergeIn(['docs'], Map({
        isFetching: false,
        documentsFetchError: fromJS(action.error)
      }));

    /**
     * In case we're viewing our profile and have updated it from the
     * profile page, let the state know.
     */
    case actionTypes.USER_DETAILS_UPDATE_SUCCESS: {
      const selectedUser = state.getIn(['profile', 'user']).toJS();
      if (selectedUser._id === action.user._id) {
        return state.mergeIn(['profile'], Map({
          user: fromJS(action.user)
        }));
      }

      return state;
    }

    case actionTypes.ANOTHER_USER_PROFILE_UPDATE_REQUEST:
      return state.mergeIn(['profile'], Map({
        isFetching: true,
        updatedUser: fromJS(action.updatedUser)
      }));

    case actionTypes.ANOTHER_USER_PROFILE_UPDATE_SUCCESS:
      return state.mergeIn(['profile'], Map({
        isFetching: false,
        user: fromJS(action.user),
        updatedUser: fromJS(action.user)
      }));

    case actionTypes.ANOTHER_USER_PROFILE_UPDATE_FAILURE:
      return state.mergeIn(['profile'], Map({
        isFetching: false,
        profileFetchError: fromJS(action.error)
      }));

    case actionTypes.ANOTHER_USER_DETAILS_FIELD_UPDATE:
      return state.mergeIn(['profile'], Map({
        updatedUser: fromJS(action.updatedUser)
      }));

    case actionTypes.VALIDATE_ANOTHER_USER_DETAILS_FIELD:
      return state
        .mergeIn(['profile'], fieldsValidationReducer(state.get('profile'), {
          type: action.field,
          target: 'updatedUser',
          currentView: 'userDetails'
        }));

    default:
      return state;
  }
}

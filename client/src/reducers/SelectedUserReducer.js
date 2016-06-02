import {List, Map, fromJS} from 'immutable';

import * as actionTypes from '../constants';

const INITIAL_SELECTED_USER_STATE = Map({
  docs: Map({
    isFetching: false,
    documents: List(),
    documentsFetchError: Map()
  }),
  profile: Map({
    isFetchingProfile: true,
    user: Map(),
    profileFetchError: Map()
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
        isFetchingProfile: false,
        user: fromJS(action.profileData)
      }));

    case actionTypes.FETCH_ANOTHER_USERS_PROFILE_FAILURE:
      return state.mergeIn(['profile'], Map({
        isFetchingProfile: false,
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

    default:
      return state;
  }
}

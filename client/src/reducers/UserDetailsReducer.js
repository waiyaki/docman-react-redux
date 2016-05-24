import {Map, fromJS} from 'immutable';

import * as actionTypes from '../constants';

const INITIAL_USER_DETAILS_STATE = Map({
  isFetching: false,
  user: null,
  fetchError: null
});

export default function (state = INITIAL_USER_DETAILS_STATE, action) {
  switch (action.type) {
    case actionTypes.FETCH_USER_DETAILS_REQUEST:
      return state.merge(Map({
        isFetching: true
      }));

    case actionTypes.FETCH_USER_DETAILS_SUCCESS:
      return state.merge(Map({
        isFetching: false,
        user: fromJS(action.user)
      }));

    case actionTypes.FETCH_USER_DETAILS_ERROR:
      if (actionTypes.authError) {
        return state.merge(INITIAL_USER_DETAILS_STATE);
      }
      return state.merge({
        isFetching: false,
        fetchError: fromJS(action.error)
      });

    case actionTypes.USER_DETAILS_UPDATE_REQUEST:
      return state.merge(Map({
        isFetching: true,
        userUpdate: fromJS(action.userUpdate)
      }));

    case actionTypes.USER_DETAILS_UPDATE_SUCCESS:
      return state.merge(Map({
        isFetching: false,
        userUpdate: null,
        user: fromJS(action.user)
      }));

    case actionTypes.USER_DETAILS_UPDATE_FAILURE:
      return state.merge(Map({
        isFetching: false,
        userUpdateError: fromJS(action.error)
      }));

    case actionTypes.LOGOUT_REQUEST:
      return state.merge(INITIAL_USER_DETAILS_STATE);

    default:
      return state;
  }
}

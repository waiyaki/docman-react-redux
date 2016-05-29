import {List, Map, fromJS} from 'immutable';

import * as actionTypes from '../constants';

const INITIAL_ROLES_STATE = Map({
  roles: List(),
  isFetching: false,
  rolesFetchError: null
});

export default function (state = INITIAL_ROLES_STATE, action) {
  switch (action.type) {
    case actionTypes.FETCH_ROLES_REQUEST:
      return state.merge(Map({
        isFetching: true
      }));

    case actionTypes.FETCH_ROLES_SUCCESS:
      return state.merge(Map({
        isFetching: false,
        roles: fromJS(action.roles)
      }));

    case actionTypes.FETCH_ROLES_FAILURE:
      return state.merge(Map({
        isFetching: false,
        rolesFetchError: fromJS(action.error)
      }));

    default:
      return state;
  }
}

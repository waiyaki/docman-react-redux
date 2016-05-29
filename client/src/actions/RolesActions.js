import Axios from 'axios';

import * as actionTypes from '../constants';

export function fetchRolesRequest () {
  return {
    type: actionTypes.FETCH_ROLES_REQUEST
  };
}

export function fetchRolesSuccess (rolesData) {
  return {
    type: actionTypes.FETCH_ROLES_SUCCESS,
    roles: rolesData.data
  };
}

export function fetchRolesFailure (error) {
  return {
    type: actionTypes.FETCH_ROLES_FAILURE,
    error: error.data || {message: error.message}
  };
}

export function fetchRoles () {
  return function (dispatch) {
    dispatch(fetchRolesRequest());

    return Axios
      .get('/api/roles', {
        headers: {'x-access-token': window.localStorage.getItem('token')}
      })
      .then((rolesData) => {
        dispatch(fetchRolesSuccess(rolesData));
      })
      .catch((error) => {
        dispatch(fetchRolesFailure(error));
      });
  };
}

/**
 * Fetch roles from the server.
 *
 * Only do so if we don't already have roles in the state or if we're forcing
 * the fetch.
 */
export function fetchRolesIfNecessary (force = false) {
  return function (dispatch, getState) {
    const roles = getState().getIn(['roles', 'roles']);
    if (!roles.size || force) {
      return dispatch(fetchRoles());
    }
  };
}

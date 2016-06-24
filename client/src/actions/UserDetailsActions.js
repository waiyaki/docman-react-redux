import Axios from 'axios';

import * as actionTypes from '../constants';
import { logoutUser } from './AuthActions';
import { showSnackBarMessage } from './UtilityActions';
import { subscribeToUpdates, registerSockets } from './SocketsActions';
import { getAuthToken, parseUserFromToken } from '../utils';
import { fetchDocumentsFromServer } from './DocumentsActions';

export function requestFetchUserDetails() {
  return {
    type: actionTypes.FETCH_USER_DETAILS_REQUEST
  };
}

export function fetchUserDetailsSuccess(user) {
  return {
    type: actionTypes.FETCH_USER_DETAILS_SUCCESS,
    user: user.data
  };
}

export function fetchUserDetailsError(
  error,
  authError = false,
  notFound = false
) {
  return {
    type: actionTypes.FETCH_USER_DETAILS_ERROR,
    error: error.data || { message: error.message },
    authError,
    notFound
  };
}

/**
 * Load user details from the server.
 * Happens if there's a cached token in localStorage and we do not have details
 * about the currently logged in user.
 *
 * Called when a user comes back to the application acts as a means
 * of token validation.
 */
export function loadUserDetails(authToken = getAuthToken()) {
  return (dispatch) => {
    if (!authToken) {
      return dispatch(logoutUser(false));
    }

    // Get User Payload from the base64 encoded token.
    const user = parseUserFromToken();
    dispatch(requestFetchUserDetails());

    return Axios
      .get(`/api/users/${user._id}`, {
        headers: { 'x-access-token': authToken }
      })
      .then((userData) => {
        dispatch(fetchUserDetailsSuccess(userData));
        dispatch(registerSockets());
        dispatch(subscribeToUpdates(userData.data));
      })
      .catch((error) => {
        // If we get a 401 while fetching this user's details using the cached
        // token, that token is invalid. Log them out.
        if (error.status === 401) {
          dispatch(fetchUserDetailsError(error, true));
          dispatch(logoutUser(false));
        } else if (error.status === 404) {
          dispatch(fetchUserDetailsError(error, false, true));
        } else {
          dispatch(fetchUserDetailsError(error));
        }
      });
  };
}

export function requestUserDetailsUpdate(updatedUser) {
  return {
    type: actionTypes.USER_DETAILS_UPDATE_REQUEST,
    updatedUser
  };
}

export function userDetailsUpdateSuccess(updatedUser) {
  return {
    type: actionTypes.USER_DETAILS_UPDATE_SUCCESS,
    user: updatedUser.data
  };
}

export function userDetailsUpdateFailure(error) {
  return {
    type: actionTypes.USER_DETAILS_UPDATE_FAILURE,
    error: error.data || { message: error.message }
  };
}

export function updateUserDetails(updatedUserObject, authToken = getAuthToken()) {
  return (dispatch, getState) => {
    dispatch(requestUserDetailsUpdate(updatedUserObject));
    const auth = getState().get('auth').toJS();
    return Axios
      .put(`/api/users/${auth.user._id}`, updatedUserObject, {
        headers: { 'x-access-token': authToken }
      })
      .then((updatedUser) => {
        // If this user's role changed, fetch documents again from server
        // to ensure we don't have documents in state that we should no longer
        // have access to.
        const user = updatedUser.data;
        if (user.role && user.role.title !== auth.user.role.title) {
          dispatch(fetchDocumentsFromServer());
        }
        dispatch(userDetailsUpdateSuccess(updatedUser));
        dispatch(showSnackBarMessage('Successfully updated profile.'));
      })
      .catch((error) => {
        dispatch(userDetailsUpdateFailure(error));
        dispatch(showSnackBarMessage('Oops! An error occurred.'));
      });
  };
}

export function userDetailsFieldUpdate(updatedUser) {
  return {
    type: actionTypes.USER_DETAILS_FIELD_UPDATE,
    updatedUser
  };
}
export function toggleShowUserUpdateView() {
  return {
    type: actionTypes.TOGGLE_SHOW_USER_UPDATE_VIEW
  };
}

/**
 * Fetch documents belonging to a particular user
 */
export function requestFetchUserDocuments() {
  return {
    type: actionTypes.USER_DOCUMENTS_FETCH_REQUEST
  };
}

export function userDocumentsFetchSuccess(documentsData) {
  return {
    type: actionTypes.USER_DOCUMENTS_FETCH_SUCCESS,
    documents: documentsData.data
  };
}

export function userDocumentsFetchFailure(error) {
  return {
    type: actionTypes.USER_DOCUMENTS_FETCH_FAILURE,
    error: error.data || { message: error.message }
  };
}

export function fetchUserDocuments(usernameOrId, authToken = getAuthToken()) {
  return (dispatch) => {
    dispatch(requestFetchUserDocuments());

    return Axios
      .get(`/api/users/${usernameOrId}/documents`, {
        headers: { 'x-access-token': authToken }
      })
      .then((documentsData) => {
        dispatch(userDocumentsFetchSuccess(documentsData));
      })
      .catch((error) => {
        dispatch(userDocumentsFetchFailure(error));
        if (error.status !== 404) {
          dispatch(showSnackBarMessage(
            `Error getting ${usernameOrId}'s documents.`
          ));
        }
      });
  };
}

/**
 * Fetch user profile belonging to another user.
 */
export function fetchAnotherUsersProfileRequest(username) {
  return {
    type: actionTypes.FETCH_ANOTHER_USERS_PROFILE_REQUEST,
    username
  };
}

export function fetchAnotherUsersProfileSuccess(profileData) {
  return {
    type: actionTypes.FETCH_ANOTHER_USERS_PROFILE_SUCCESS,
    profileData: profileData.data
  };
}

export function fetchAnotherUsersProfileFailure(error, notFound = false) {
  return {
    type: actionTypes.FETCH_ANOTHER_USERS_PROFILE_FAILURE,
    error: {
      message: error.data ? error.data.message : error.message,
      notFound
    }
  };
}

export function fetchAnotherUsersProfile(username, authToken = getAuthToken()) {
  return (dispatch) => {
    dispatch(fetchAnotherUsersProfileRequest(username));

    return Axios
      .get(`/api/users/${username}`, {
        headers: { 'x-access-token': authToken }
      })
      .then((userProfileData) => {
        dispatch(fetchAnotherUsersProfileSuccess(userProfileData));
      })
      .catch((error) => {
        if (error.status === 404) {
          dispatch(fetchAnotherUsersProfileFailure(error, true));
          dispatch(showSnackBarMessage(`Uh oh! We didn't find ${username}`));
        } else {
          dispatch(fetchAnotherUsersProfileFailure(error));
          dispatch(showSnackBarMessage(`Error fetching ${username}'s profile`));
        }
      });
  };
}

export function updateAnotherUsersProfileRequest(updatedUser) {
  return {
    type: actionTypes.ANOTHER_USER_PROFILE_UPDATE_REQUEST,
    updatedUser
  };
}

export function updateAnotherUsersProfileSuccess(updatedUser) {
  return {
    type: actionTypes.ANOTHER_USER_PROFILE_UPDATE_SUCCESS,
    user: updatedUser.data
  };
}

export function updateAnotherUsersProfileFailure(error) {
  return {
    type: actionTypes.ANOTHER_USER_PROFILE_UPDATE_FAILURE,
    error: error.data || { message: error.message }
  };
}

export function updateAnotherUsersProfile(
  updatedUserObject, authToken = getAuthToken()
) {
  return (dispatch, getState) => {
    dispatch(updateAnotherUsersProfileRequest(updatedUserObject));

    const selectedUser = getState().get('selectedUser').toJS();
    return Axios
      .put(`/api/users/${selectedUser.profile.user._id}`, updatedUserObject, {
        headers: { 'x-access-token': authToken }
      })
      .then((updatedUser) => {
        dispatch(updateAnotherUsersProfileSuccess(updatedUser));
        dispatch(showSnackBarMessage(
          `${selectedUser.profile.user.username}'s profile update successful.`
        ));
      })
      .catch((error) => {
        dispatch(updateAnotherUsersProfileFailure(error));
        dispatch(showSnackBarMessage(
          `Error updating ${selectedUser.profile.user.username}'s profile`
        ));
      });
  };
}

export function anotherUserDetailsFieldUpdate(updatedUser) {
  return {
    type: actionTypes.ANOTHER_USER_DETAILS_FIELD_UPDATE,
    updatedUser
  };
}

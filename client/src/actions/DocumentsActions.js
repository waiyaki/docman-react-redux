/**
 * Document related actions.
 * Includes actions for fetching, updating and deleting documents.
 */
import Axios from 'axios';

import * as actionTypes from '../constants';

/**
 * Document fetching actions
 */
export function fetchDocumentsRequest () {
  return {
    type: actionTypes.FETCH_DOCUMENTS_REQUEST
  };
}

export function fetchDocumentsSuccess (documentsResponse) {
  return {
    type: actionTypes.FETCH_DOCUMENTS_SUCCESS,
    documents: documentsResponse.data
  };
}

export function fetchDocumentsFailure (error) {
  return {
    type: actionTypes.FETCH_DOCUMENTS_FAILURE,
    error: error.data || {message: error.message}
  };
}

/**
 * Fetch documents from the server asynchronously.
 */
export function fetchDocumentsFromServer () {
  return function (dispatch) {
    dispatch(fetchDocumentsRequest());

    return Axios
      .get('/api/documents', {
        headers: {'x-access-token': window.localStorage.getItem('token')}
      })
      .then((documents) => {
        dispatch(fetchDocumentsSuccess(documents));
      })
      .catch((error) => {
        dispatch(fetchDocumentsFailure(error));
      });
  };
}

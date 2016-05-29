/**
 * Document related actions.
 * Includes actions for fetching, updating and deleting documents.
 */
import Axios from 'axios';

import * as actionTypes from '../constants';
import {showSnackBarMessage} from './UtilityActions';

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

/**
 * Expand a single document.
 */
export function expandDocument (docId) {
  return {
    type: actionTypes.EXPAND_DOCUMENT,
    docId: docId || ''
  };
}

/**
 * Create a document.
 */
export function createDocumentRequest (documentContent) {
  return {
    type: actionTypes.CREATE_DOCUMENT_REQUEST,
    documentContent
  };
}

/**
 * Perform this action once the creation is successful.
 */
export function createDocumentSuccess (documentData) {
  return {
    type: actionTypes.CREATE_DOCUMENT_SUCCESS,
    documentContent: documentData.data
  };
}

/**
 * Handle create document failure.
 */
export function createDocumentFailure (error) {
  return {
    type: actionTypes.CREATE_DOCUMENT_FAILURE,
    error: error.data || {message: error.message}
  };
}

/**
 * Perform the actual document creation by posting data to the server.
 *
 * Dispatches appropriate actions according to the current state of the
 * document creation request. When dispatching createDocumentRequest, we
 * fake the document's details so that we can perform an optimistic update
 * without breaking the application's functionality.
 */
export function createDocument (content) {
  return (dispatch, getState) => {
    // Get the authenticated user's details.
    const auth = getState().get('auth').toJS();

    // Fake and dispatch documents details to enable optimistic update
    // without breaking functionality.
    dispatch(createDocumentRequest(Object.assign({}, content, {
      owner: auth.user,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      _id: Math.floor(Math.random()).toString(32)
    })));

    return Axios
      .post('/api/documents', content, {
        headers: {'x-access-token': window.localStorage.getItem('token')}
      })
      .then((data) => {
        dispatch(createDocumentSuccess(data));
        dispatch(showSnackBarMessage('Successfully created document.'));
      })
      .catch((error) => {
        dispatch(createDocumentFailure(error));
        dispatch(showSnackBarMessage('Uh oh! An error occurred.'));
      });
  };
}

/**
 * Show or hide the new document modal.
 */
export function toggleCreateModal () {
  return {
    type: actionTypes.TOGGLE_CREATE_MODAL
  };
}

/**
 * Update the content (in the state) of the document being created.
 */
export function updateNewDocumentContents (documentContent) {
  return {
    type: actionTypes.UPDATE_NEW_DOCUMENT_CONTENTS,
    documentContent
  };
}

export function validateDocumentContents (field) {
  return {
    type: actionTypes.VALIDATE_NEW_DOCUMENT_CONTENTS,
    field
  };
}

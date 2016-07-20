import { List, Map, fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';

import * as actionTypes from '../constants';
import fieldsValidationReducer from './FieldsValidationReducer';

export const INITIAL_DOCUMENTS_STATE = Map({
  documents: List(),
  isFetching: false,
  documentsFetchError: null,
  documentViewOptions: Map({
    expandedDocId: '',
    visibleFilter: 'all'
  }),
  documentCrudOptions: Map({
    deletedDocument: Map(),
    documentContent: Map({
      title: '',
      content: '',
      role: ''
    }),
    isFetching: false,
    isShowingCreateModal: false,
    isUpdatingDocument: false,
    crudError: null,
    validations: Map({
      isValid: false
    })
  })
});


/**
 * Set a newly created document into the state.
 *
 * This newly created document replaces the document we'd earlier used
 * when performing the optimistic update, if we're the ones that created it.
 * Otherwise, we insert it at the beginning of our documents list in the
 * state.
 */
function replaceOwnDocumentOrInsert(state, action) {
  if (action.own) {
    return state.map(doc => {
      if (doc.get('optimistic')) {
        return fromJS(action.documentContent);
      }
      return doc;
    });
  }

  return fromJS([action.documentContent]).concat(state);
}

/**
 * Handle document's state update accordingly if the role of a particular
 * document changed.
 *
 * If we no longer have access to this doc, remove it from state.
 *
 * If we still have access to the document, replace the copy we have with
 * the new copy that has the updated role permissions.
 *
 * If we have access to the document but didn't have it in state, insert it
 * as the first document.
 */
function documentRoleUpdate(state, action) {
  const cachedDocIndex = state.findIndex(doc =>
    doc.get('_id') === action.document._id
  );

  if (!action.allowAccess && ~cachedDocIndex) {
    return state
      .slice(0, cachedDocIndex)
      .concat(state.slice(cachedDocIndex + 1));
  } else if (action.allowAccess && ~cachedDocIndex) {
    return state
      .slice(0, cachedDocIndex)
      .concat(fromJS([action.document]), state.slice(cachedDocIndex + 1));
  } else if (action.allowAccess && cachedDocIndex === -1) {
    return fromJS([action.document]).concat(state);
  }

  return state;
}

function updateDocument(state, action) {
  return state.map(doc => {
    if (doc.get('_id') === action.document._id) {
      return fromJS(action.document);
    }
    return doc;
  });
}

function documents(state = List(), action) {
  switch (action.type) {
    case actionTypes.FETCH_DOCUMENTS_SUCCESS:
      return fromJS(action.documents);

    case actionTypes.CREATE_DOCUMENT_REQUEST:
      return fromJS([action.documentContent]).concat(state);

    case actionTypes.CREATE_DOCUMENT_SUCCESS:
      return replaceOwnDocumentOrInsert(state, action);

    case actionTypes.CREATE_DOCUMENT_FAILURE:
      return state.filter(doc => !doc.get('optimistic'));

    case actionTypes.DOCUMENT_UPDATE_SUCCESS:
      return updateDocument(state, action);

    case actionTypes.DOCUMENT_ROLE_UPDATE:
      return documentRoleUpdate(state, action);

    case actionTypes.DELETE_DOCUMENT_REQUEST:
      return state
        .slice(0, action.deletedDocument.index)
        .concat(state.slice(action.deletedDocument.index + 1));

    case actionTypes.DELETE_DOCUMENT_SUCCESS:
      if (action.docId) { // If receiving a websocket action
        return state.filter(doc => doc.get('_id') !== action.docId);
      }
      break;

    case actionTypes.DELETE_DOCUMENT_FAILURE:
      /**
       * Deleting failed, reinsert the deleted document back
       * into state.
       */
      return state
        .slice(0, action.deletedDocument.index)
        .concat(
          fromJS([action.deletedDocument.item]),
          state.slice(action.deletedDocument.index + 1)
        );

    case actionTypes.LOGOUT_REQUEST:
      return List();

    default:
      return state;
  }

  return state;
}

function isFetching(state = false, action) {
  switch (action.type) {
    case actionTypes.FETCH_DOCUMENTS_REQUEST:
    case actionTypes.CREATE_DOCUMENT_REQUEST:
    case actionTypes.DOCUMENT_UPDATE_REQUEST:
      return true;

    case actionTypes.FETCH_DOCUMENTS_SUCCESS:
    case actionTypes.FETCH_DOCUMENTS_FAILURE:
    case actionTypes.CREATE_DOCUMENT_SUCCESS:
    case actionTypes.CREATE_DOCUMENT_FAILURE:
    case actionTypes.DOCUMENT_UPDATE_SUCCESS:
    case actionTypes.DOCUMENT_UPDATE_FAILURE:
    case actionTypes.LOGOUT_REQUEST:
      return false;

    case actionTypes.DOCUMENT_ROLE_UPDATE:
      if (action.own) {
        return false;
      }
      return state;

    default:
      return state;
  }
}

function documentsFetchError(state = null, action) {
  switch (action.type) {
    case actionTypes.FETCH_DOCUMENTS_FAILURE:
      return fromJS(action.error);

    case actionTypes.LOGOUT_REQUEST:
      return null;

    default:
      return state;
  }
}

function documentViewOptions(state = Map({
  expandedDocId: '',
  visibleFilter: 'all'
}), action) {
  switch (action.type) {
    case actionTypes.EXPAND_DOCUMENT:
      return state.merge(Map({
        expandedDocId: action.docId
      }));

    case actionTypes.CHANGE_DOCUMENTS_FILTER:
      return state.merge(Map({
        visibleFilter: action.filter
      }));

    case actionTypes.LOGOUT_REQUEST:
      return Map({
        expandedDocId: '',
        visibleFilter: 'all'
      });

    default:
      return state;
  }
}

function deletedDocument(state = Map(), action) {
  switch (action.type) {
    case actionTypes.CREATE_DOCUMENT_SUCCESS:
    case actionTypes.DOCUMENT_UPDATE_SUCCESS:
    case actionTypes.DELETE_DOCUMENT_FAILURE:
    case actionTypes.LOGOUT_REQUEST:
      return Map();

    case actionTypes.DOCUMENT_ROLE_UPDATE:
      if (action.own) {
        return Map();
      }
      return state;

    case actionTypes.DELETE_DOCUMENT_REQUEST:
      return fromJS(action.deletedDocument);

    case actionTypes.DELETE_DOCUMENT_SUCCESS:
      if (action.docId) { // If receiving a websocket action
        return state;
      }
      return Map();

    default:
      return state;
  }
}

function documentContent(state = Map({
  title: '',
  content: '',
  role: ''
}), action) {
  const initialDocumentContent = Map({
    title: '',
    content: '',
    role: ''
  });

  switch (action.type) {
    case actionTypes.CREATE_DOCUMENT_REQUEST:
    case actionTypes.UPDATE_NEW_DOCUMENT_CONTENTS:
    case actionTypes.DOCUMENT_UPDATE_REQUEST:
      return fromJS(action.documentContent || action.document);

    case actionTypes.CREATE_DOCUMENT_SUCCESS:
    case actionTypes.DOCUMENT_UPDATE_SUCCESS:
    case actionTypes.LOGOUT_REQUEST:
      return initialDocumentContent;

    case actionTypes.DOCUMENT_ROLE_UPDATE:
      if (action.own) {
        return initialDocumentContent;
      }
      return state;

    case actionTypes.TOGGLE_SHOW_DOCUMENT_UPDATE:
      if (action.isUpdatingDocument) {
        return fromJS(action.document);
      }
      return initialDocumentContent;

    default:
      return state;
  }
}

function isShowingCreateModal(state = false, action) {
  switch (action.type) {
    case actionTypes.DOCUMENT_UPDATE_REQUEST:
    case actionTypes.CREATE_DOCUMENT_SUCCESS:
    case actionTypes.DOCUMENT_UPDATE_SUCCESS:
    case actionTypes.LOGOUT_REQUEST:
      return false;

    case actionTypes.CREATE_DOCUMENT_FAILURE:
    case actionTypes.DOCUMENT_UPDATE_FAILURE:
      return true;

    case actionTypes.TOGGLE_CREATE_MODAL:
    case actionTypes.TOGGLE_SHOW_DOCUMENT_UPDATE:
      return !state;

    case actionTypes.DOCUMENT_ROLE_UPDATE:
      if (action.own) {
        return false;
      }
      return state;

    default:
      return state;
  }
}

function isUpdatingDocument(state = false, action) {
  switch (action.type) {
    case actionTypes.CREATE_DOCUMENT_SUCCESS:
    case actionTypes.DOCUMENT_UPDATE_SUCCESS:
    case actionTypes.LOGOUT_REQUEST:
      return false;

    case actionTypes.DOCUMENT_UPDATE_FAILURE:
      return true;

    case actionTypes.TOGGLE_SHOW_DOCUMENT_UPDATE:
      return !state;

    case actionTypes.DOCUMENT_ROLE_UPDATE:
      if (action.own) {
        return false;
      }
      return state;

    default:
      return state;
  }
}

function crudError(state = null, action) {
  switch (action.type) {
    case actionTypes.CREATE_DOCUMENT_SUCCESS:
    case actionTypes.DOCUMENT_UPDATE_SUCCESS:
    case actionTypes.LOGOUT_REQUEST:
      return null;

    case actionTypes.CREATE_DOCUMENT_FAILURE:
    case actionTypes.DOCUMENT_UPDATE_FAILURE:
    case actionTypes.DELETE_DOCUMENT_FAILURE:
      return fromJS(action.error);

    case actionTypes.DOCUMENT_ROLE_UPDATE:
      if (action.own) {
        return null;
      }
      return state;

    default:
      return state;
  }
}

function validations(state = Map({
  isValid: false
}), action) {
  switch (action.type) {
    case actionTypes.CREATE_DOCUMENT_SUCCESS:
    case actionTypes.DOCUMENT_UPDATE_SUCCESS:
    case actionTypes.TOGGLE_SHOW_DOCUMENT_UPDATE:
    case actionTypes.LOGOUT_REQUEST:
      return Map({
        isValid: false
      });

    case actionTypes.DOCUMENT_ROLE_UPDATE:
      if (action.own) {
        return Map({
          isValid: false
        });
      }
      return state;

    case actionTypes.VALIDATE_NEW_DOCUMENT_CONTENTS:
      return state.mergeDeep(fieldsValidationReducer(
        fromJS(action.documentCrudOptions), {
          type: action.field,
          target: 'documentContent',
          currentView: 'documentContent'
        }
      ).get('validations'));

    default:
      return state;
  }
}

const documentCrudOptions = combineReducers({
  deletedDocument,
  documentContent,
  isFetching,
  isShowingCreateModal,
  isUpdatingDocument,
  crudError,
  validations
});

export default combineReducers({
  documents,
  isFetching,
  documentsFetchError,
  documentViewOptions,
  documentCrudOptions
});

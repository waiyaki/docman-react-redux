import {List, Map, fromJS} from 'immutable';

import * as actionTypes from '../constants';
import FieldsValidationReducer from './FieldsValidationReducer';

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
 * Handle state changes related to documents.
 *
 * Performs some operation on the current state based on the specified action
 * and returns a new documents state.
 */
export default function (state = INITIAL_DOCUMENTS_STATE, action) {
  switch (action.type) {
    case actionTypes.FETCH_DOCUMENTS_REQUEST:
      return state.merge(Map({
        isFetching: true
      }));

    case actionTypes.FETCH_DOCUMENTS_SUCCESS:
      return state.merge(Map({
        isFetching: false,
        documents: fromJS(action.documents)
      }));

    case actionTypes.FETCH_DOCUMENTS_FAILURE:
      return state.merge(Map({
        isFetching: false,
        documentsFetchError: fromJS(action.error)
      }));

    case actionTypes.EXPAND_DOCUMENT:
      return state.mergeDeepIn(
        ['documentViewOptions', 'expandedDocId'], action.docId);

    /**
     * Make the state aware of that we're creating a new document.
     *
     * Also, perform an optimistic update with the document gotten from the
     * action.
     */
    case actionTypes.CREATE_DOCUMENT_REQUEST:
      return state.merge(Map({
        documents: state
          .get('documents')
          .unshift(fromJS(action.documentContent)),
        documentCrudOptions: state.get('documentCrudOptions').mergeDeep({
          documentContent: fromJS(action.documentContent),
          isFetching: true
        })
      }));

    /**
     * Set a newly created document into the state.
     *
     * This newly created document replaces the document we'd earlier used
     * when performing the optimistic update, if we're the ones that created it.
     * Otherwise, we insert it at the beginning of our documents list in the
     * state.
     */
    case actionTypes.CREATE_DOCUMENT_SUCCESS:
      if (action.own) {
        const optimisticDocIndex = state
          .get('documents')
          .findIndex((doc) => {
            return doc.get('_id') === state.getIn(
              ['documentCrudOptions', 'documentContent', '_id']);
          });
        return state.merge(Map({
          documents: state.get('documents')
            .splice(optimisticDocIndex, 1, fromJS(action.documentContent)),
          documentCrudOptions: INITIAL_DOCUMENTS_STATE.get('documentCrudOptions')
        }));
      }

      return state.merge(Map({
        documents: state
          .get('documents')
          .insert(0, fromJS(action.documentContent))
      }));

    /**
     * If an error occurred while we're creating a document, let the state know
     *
     * In addition, remove the document we'd optimistically set in the state.
     */
    case actionTypes.CREATE_DOCUMENT_FAILURE:
      return state.merge(Map({
        documents: state.get('documents').slice(1),
        documentCrudOptions: state.get('documentCrudOptions').mergeDeep(Map({
          isFetching: false,
          isShowingCreateModal: true,
          crudError: fromJS(action.error)
        }))
      }));

    case actionTypes.UPDATE_NEW_DOCUMENT_CONTENTS:
      return state.mergeDeepIn(['documentCrudOptions'], {
        documentContent: fromJS(action.documentContent)
      });

    case actionTypes.TOGGLE_CREATE_MODAL:
      return state.mergeDeepIn(['documentCrudOptions'], {
        isShowingCreateModal: !state.getIn(
          ['documentCrudOptions', 'isShowingCreateModal'])
      });

    /**
     * Update a document's details.
     *
     * TODO: Maybe add an optimistic update here 😕
     */
    case actionTypes.DOCUMENT_UPDATE_REQUEST:
      return state.merge(Map({
        documentCrudOptions: state.get('documentCrudOptions').mergeDeep(Map({
          documentContent: fromJS(action.document),
          isFetching: true,
          isShowingCreateModal: false
        }))
      }));

    /**
     * Handle a successful document update.
     *
     * Filter out the document to update and replace it
     * with the updated document.
     */
    case actionTypes.DOCUMENT_UPDATE_SUCCESS:
      let documents = state.get('documents');
      return state.merge(Map({
        documents: documents.map((doc) => {
          if (doc.get('_id') === action.document._id) {
            return fromJS(action.document);
          }
          return doc;
        }),
        documentCrudOptions: INITIAL_DOCUMENTS_STATE.get('documentCrudOptions')
      }));

    // TODO: If we add optimistic update, remember to roll that back here. 😰
    case actionTypes.DOCUMENT_UPDATE_FAILURE:
      return state.merge(Map({
        documentCrudOptions: state.get('documentCrudOptions').mergeDeep(Map({
          isFetching: false,
          isShowingCreateModal: true,
          isUpdatingDocument: true,
          crudError: fromJS(action.error)
        }))
      }));

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
    case actionTypes.DOCUMENT_ROLE_UPDATE:
      const cachedDocIndex = state
        .get('documents')
        .findIndex((doc) => doc.get('_id') === action.document._id);

      if (!action.allowAccess && ~cachedDocIndex) {
        return state.merge(Map({
          documents: state.get('documents').splice(cachedDocIndex, 1),
          documentCrudOptions: INITIAL_DOCUMENTS_STATE.get(
            'documentCrudOptions')
        }));
      } else if (action.allowAccess && ~cachedDocIndex) {
        return state.merge(Map({
          documents: state.get('documents')
            .splice(cachedDocIndex, 1, fromJS(action.document)),
          documentCrudOptions: INITIAL_DOCUMENTS_STATE.get(
            'documentCrudOptions')
        }));
      } else if (action.allowAccess && cachedDocIndex === -1) {
        return state.merge(Map({
          documents: state.get('documents').insert(0, fromJS(action.document)),
          documentCrudOptions: INITIAL_DOCUMENTS_STATE.get(
            'documentCrudOptions')
        }));
      }
      return state;

    /**
     * Set the document that we're updating as well as
     * show or hide the create/update document modal.
     */
    case actionTypes.TOGGLE_SHOW_DOCUMENT_UPDATE:
      // Hide or show the document create/update modal.
      const newState = state.mergeDeepIn(['documentCrudOptions'], Map({
        documentContent: fromJS(action.document),
        isShowingCreateModal: !state.getIn(
          ['documentCrudOptions', 'isShowingCreateModal']
        ),
        isUpdatingDocument: !state.getIn(
          ['documentCrudOptions', 'isUpdatingDocument']
        ),
        validations: Map({
          isValid: false
        })
      }));

      // If we are not updating a document, clear out whatever contents we had
      // cached in documentContent, so that if a user shows the modal again,
      // it won't have stale content.
      if (!newState.getIn(['documentCrudOptions', 'isUpdatingDocument'])) {
        return newState.mergeDeepIn(
          ['documentCrudOptions', 'documentContent'],
          INITIAL_DOCUMENTS_STATE
              .getIn(['documentCrudOptions', 'documentContent'])
        );
      }
      return newState;

    /**
     * Perform a document deletion.
     *
     * Make an optimistic deletion, but cache the deleted document together
     * with it's index so we can roll back if the server errors.
     */
    case actionTypes.DELETE_DOCUMENT_REQUEST:
      let deletedDocument;
      return state.merge(Map({
        documents: state.get('documents').filter((doc, index) => {
          if (doc.get('_id') === action.documentId) {
            deletedDocument = Map({
              index: index,
              item: doc
            });
            return false;
          }
          return true;
        }),
        documentCrudOptions: state.get('documentCrudOptions').mergeDeep(Map({
          deletedDocument: deletedDocument
        }))
      }));

    /**
     * Remove the cached deleted document if the deletion was successful
     * server-side.
     */
    case actionTypes.DELETE_DOCUMENT_SUCCESS:
      if (action.docId) { // docId would come from the websocket action.
        return state.merge(Map({
          documents: state.get('documents')
            .filter(doc => doc.get('_id') !== action.docId),
          documentCrudOptions: INITIAL_DOCUMENTS_STATE.get(
            'documentCrudOptions')
        }));
      }
      return state.mergeIn(
        ['documentCrudOptions'],
        INITIAL_DOCUMENTS_STATE.get('documentCrudOptions')
      );

    /**
     * Roll back the optimistic update we made when requesting for a document
     * deletion and insert that document back into the documents list.
     */
    case actionTypes.DELETE_DOCUMENT_FAILURE:
      let delDocument = state.getIn(
        ['documentCrudOptions', 'deletedDocument']).toJS();

      return state.merge(Map({
        documents: state
          .get('documents')
          .insert(delDocument.index, fromJS(delDocument.item)),
        documentCrudOptions: state.get('documentCrudOptions').merge(Map({
          deletedDocument: Map(),
          crudError: fromJS(action.error)
        }))
      }));

    /**
     * Validate the fields entered by the user when they're creating a new
     * document.
     * Modify the behaviour of the FieldsValidationReducer based on the fact
     * that we're validating new document fields.
     */
    case actionTypes.VALIDATE_NEW_DOCUMENT_CONTENTS:
      return state.mergeDeepIn(['documentCrudOptions'], FieldsValidationReducer(
        state.get('documentCrudOptions'), {
          type: action.field,
          target: 'documentContent',
          currentView: 'documentContent'
        }
      ));

    case actionTypes.CHANGE_DOCUMENTS_FILTER:
      return state.mergeDeep(Map({
        documentViewOptions: Map({
          visibleFilter: action.filter
        })
      }));

    /**
     * Reset state to original state when the user logs out.
     */
    case actionTypes.LOGOUT_REQUEST:
      return INITIAL_DOCUMENTS_STATE;

    default:
      return state;
  }
}

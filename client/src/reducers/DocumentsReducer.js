import {List, Map, fromJS} from 'immutable';

import * as actionTypes from '../constants';
import FieldsValidationReducer from './FieldsValidationReducer';

const INITIAL_DOCUMENTS_STATE = Map({
  documents: List(),
  isFetching: false,
  documentsFetchError: null,
  documentViewOptions: Map({
    expandedDocId: ''
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
      return state.merge(Map({
        documentViewOptions: Map({
          expandedDocId: action.docId
        })
      }));

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
     * when performing the optimistic update.
     */

    // TODO: Check the possibility of a bug here: The .slice assumes that the
    // last document to be added to the list was the document from the
    // request document creation action.
    // Need a better way to handle this update. :/
    case actionTypes.CREATE_DOCUMENT_SUCCESS:
      return state.merge(Map({
        documents: state.get('documents')
          .slice(1)
          .unshift(fromJS(action.documentContent)),
        documentCrudOptions: INITIAL_DOCUMENTS_STATE.get('documentCrudOptions')
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
     * Set the document that we're updating as well as
     * show or hide the create/update document modal.
     */
    case actionTypes.TOGGLE_SHOW_DOCUMENT_UPDATE:
      return state.mergeDeepIn(['documentCrudOptions'], Map({
        documentContent: fromJS(action.document),
        isShowingCreateModal: !state.getIn(
          ['documentCrudOptions', 'isShowingCreateModal']
        ),
        isUpdatingDocument: !state.getIn(
          ['documentCrudOptions', 'isUpdatingDocument']
        )
      }));

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
        documentCrudOptions: state.get('documentCrudOptions').mergeDeep(Map({
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

    default:
      return state;
  }
}

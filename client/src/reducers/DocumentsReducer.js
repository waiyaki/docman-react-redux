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
    documentContent: Map({
      title: '',
      content: '',
      role: ''
    }),
    isFetching: false,
    isShowingCreateModal: false,
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
        documents: state.get('documents').unshift(action.documentContent),
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
          .unshift(action.documentContent),
        documentCrudOptions: state.get('documentCrudOptions').mergeDeep(
          INITIAL_DOCUMENTS_STATE.get('documentCrudOptions')
        )
      }));

    /**
     * If an error occurred while we're creating a document, let the state know
     *
     * In addition, remove the document we'd optimistically set in the state.
     */
    case actionTypes.CREATE_DOCUMENT_FAILURE:
      return state.merge(Map({
        documents: state.get('documents').slice(1),
        documentCrudOptions: state.get('documentCrudOptions').mergeDeep({
          isFetching: false,
          isShowingCreateModal: true,
          crudError: fromJS(action.error)
        })
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

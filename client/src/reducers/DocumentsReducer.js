import {List, Map, fromJS} from 'immutable';

import * as actionTypes from '../constants';

const INITIAL_DOCUMENTS_STATE = Map({
  documents: List(),
  isFetching: false,
  documentsFetchError: null,
  documentViewOptions: Map({
    expandedDocId: ''
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
        documentsFetchError: action.error
      }));

    case actionTypes.EXPAND_DOCUMENT:
      return state.merge(Map({
        documentViewOptions: Map({
          expandedDocId: action.docId
        })
      }));

    default:
      return state;
  }
}
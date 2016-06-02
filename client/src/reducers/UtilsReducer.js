/**
 * This reducer handles utility actions that do not fit into any other
 * category, or actions that are too general to be in other categories, e.g
 * showing toast messages.
 */

import {Map} from 'immutable';

import * as actionTypes from '../constants';

const INITIAL_UTILITY_STATE = Map({
  isShowingSnackBar: false,
  snackBarMessage: null
});

export default function (state = INITIAL_UTILITY_STATE, action) {
  switch (action.type) {
    /**
     * Clear any snackbar messages that we might be showing.
     * This action may be invoked by a timeout or direct user interaction
     * with the snackbar.
     */
    case actionTypes.CLEAR_SNACKBAR_MESSAGE:
      return state.merge(INITIAL_UTILITY_STATE);

    /**
     * Show a snackbar with the message specified in the action.
     */
    case actionTypes.SHOW_SNACKBAR_MESSAGE:
      return state.merge(Map({
        isShowingSnackBar: true,
        snackBarMessage: action.message
      }));

    case actionTypes.LOGOUT_REQUEST:
      return INITIAL_UTILITY_STATE;

    default:
      return state;
  }
}

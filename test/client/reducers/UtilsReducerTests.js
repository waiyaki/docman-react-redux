import { Map } from 'immutable';
import { expect } from 'chai';

import * as actionTypes from '../../../client/src/constants';

import utilsReducer, {
  INITIAL_UTILITY_STATE
} from '../../../client/src/reducers/UtilsReducer';

describe('Utility Reducer', () => {
  it('should return the initial state', () => {
    expect(utilsReducer(undefined, {})).to.eql(INITIAL_UTILITY_STATE);
  });

  it('should handle CLEAR_SNACKBAR_MESSAGE', () => {
    const state = Map({
      isShowingSnackBar: true,
      snackBarMessage: 'This is a test'
    });
    const action = { type: actionTypes.CLEAR_SNACKBAR_MESSAGE };

    expect(utilsReducer(state, action)).to.eql(INITIAL_UTILITY_STATE);
  });

  it('should handle SHOW_SNACKBAR_MESSAGE', () => {
    const action = {
      type: actionTypes.SHOW_SNACKBAR_MESSAGE,
      message: 'This is a test'
    };

    expect(utilsReducer(INITIAL_UTILITY_STATE, action)).to.eql(Map({
      isShowingSnackBar: true,
      snackBarMessage: action.message
    }));
  });

  it('should handle LOGOUT_REQUEST', () => {
    expect(utilsReducer(Map(), { type: actionTypes.LOGOUT_REQUEST }))
      .to.eql(INITIAL_UTILITY_STATE);
  });
});

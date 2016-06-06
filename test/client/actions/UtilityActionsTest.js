import {expect} from 'chai';

import * as utilActions from '../../../client/src/actions/UtilityActions';
import * as actionTypes from '../../../client/src/constants';

describe('UtilityActions', () => {
  it('creates an action to show snackbar message', () => {
    const message = 'test message';
    const expectedAction = {
      type: actionTypes.SHOW_SNACKBAR_MESSAGE,
      message
    };

    expect(utilActions.showSnackBarMessage('test message'))
      .to.eql(expectedAction);
  });

  it('creates an action to dismiss snackbar message', () => {
    const expectedAction = {
      type: actionTypes.CLEAR_SNACKBAR_MESSAGE
    };

    expect(utilActions.clearToastMessage())
      .to.eql(expectedAction);
  });
});

import { expect } from 'chai';

import * as validations from '../../../client/src/actions/ValidationActions';
import * as actionTypes from '../../../client/src/constants';

describe('ValidationActions', () => {
  it('creates action to indicate an auth field should be validated', () => {
    const field = 'username';
    const expectedAction = {
      type: actionTypes.VALIDATE_AUTH_FIELD,
      field
    };

    expect(validations.validateAuthField(field)).to.eql(expectedAction);
  });

  it('creates action for user details fields validations', () => {
    const field = 'email';
    const expectedAction = {
      type: actionTypes.VALIDATE_USER_DETAILS_FIELD,
      field
    };

    expect(validations.validateUserDetailsField(field)).to.eql(expectedAction);
  });
});

import React from 'react';
import { expect } from 'chai';

import { shallowWithContext } from '../utils';
// eslint-disable-next-line
import ConfirmDeleteDocument from '../../../../client/src/components/Documents/ConfirmDeleteDocument';

describe('ConfirmDeleteDocument', () => {
  const props = {
    confirmDeleteDocument: () => {},
    isShowingConfirmDialog: () => true
  };

  it("renders a Dialog with title 'Confirm Document Deletion'", () => {
    const wrapper = shallowWithContext(<ConfirmDeleteDocument {...props} />);
    expect(wrapper.props().title).to.eql('Confirm Document Deletion');
  });
});

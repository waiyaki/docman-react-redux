import React from 'react';
import {shallowWithContext} from '../utils';
import {expect} from 'chai';

import DocumentsLoading from '../../../../client/src/components/Documents/DocumentsLoading';

describe('DocumentsLoading', () => {
  it('renders a spinner', () => {
    const wrapper = shallowWithContext(<DocumentsLoading />);
    expect(wrapper.childAt(0).childAt(0).childAt(0).is('CircularProgress'))
      .to.be.true;
  });
});

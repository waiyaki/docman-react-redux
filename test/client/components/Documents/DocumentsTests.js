import React from 'react';
import { shallowWithContext } from '../utils';
import { expect } from 'chai';

import Documents from '../../../../client/src/components/Documents/Documents';

describe('Documents', () => {
  const props = {
    documents: [{
      _id: Math.random().toString(32),
      title: 'Test1',
      content: 'test content1',
      role: {
        title: 'public'
      },
      owner: {
        role: {
          title: 'user'
        }
      },
      updatedAt: Date.now()
    }, {
      _id: Math.random().toString(32),
      title: 'Test2',
      content: 'test content2',
      role: {
        title: 'public'
      },
      owner: {
        role: {
          title: 'user'
        }
      },
      updatedAt: Date.now()
    }],
    documentCrudOptions: {
      documentContent: {}
    },
    shouldWeAllowEditDocument: () => false,
    appliedFilter: 'all'
  };

  it('renders documents', () => {
    const wrapper = shallowWithContext(<Documents {...props} />);
    expect(wrapper.find('Document').length).to.equal(2);
  });

  it('renders a placeholder when there are no documents', () => {
    const wrapper = shallowWithContext(<Documents {...props} />);
    wrapper.setProps({
      documents: []
    });
    expect(wrapper.childAt(0).text()).to.eql('No Documents Found.');
  });

  it('shows a message when the selected filter has no documents', () => {
    const wrapper = shallowWithContext(<Documents {...props} />);
    wrapper.setProps({
      documents: [],
      appliedFilter: 'admin'
    });
    expect(wrapper.childAt(0).text())
      .to.eql("No Documents Matching Role 'admin' Were Found.");
  });
});

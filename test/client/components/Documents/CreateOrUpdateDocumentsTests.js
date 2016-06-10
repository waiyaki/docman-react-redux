import React from 'react';
import {shallowWithContext} from '../utils';
import {expect} from 'chai';

import CreateOrUpdateDocument from '../../../../client/src/components/Documents/CreateOrUpdateDocument';

describe('CreateOrUpdateDocument', () => {
  const props = {
    documentContent: {},
    isShowingCreateModal: true,
    isUpdatingDocument: false,
    onFieldUpdate: () => {},
    onRoleFieldUpdate: () => {},
    onSubmit: () => {},
    onToggleShowModal: () => {},
    roles: [],
    validations: {
      isValid: false
    }
  };

  it('renders a create document modal', () => {
    const wrapper = shallowWithContext(<CreateOrUpdateDocument {...props} />);
    expect(wrapper.childAt(1).props().title).to.eql('Create a new document');
  });

  it('renders an update document modal', () => {
    const wrapper = shallowWithContext(<CreateOrUpdateDocument {...props} />);
    wrapper.setProps({isUpdatingDocument: true});
    expect(wrapper.childAt(1).props().title).to.eql('Update Document');
  });

  it('renders a title input field', () => {
    const wrapper = shallowWithContext(<CreateOrUpdateDocument {...props} />);
    expect(wrapper.childAt(1).childAt(0).childAt(0).props().name)
      .to.equal('title');
  });

  it('renders a content input field', () => {
    const wrapper = shallowWithContext(<CreateOrUpdateDocument {...props} />);
    expect(wrapper.childAt(1).childAt(1).childAt(0).props().name)
      .to.equal('content');
  });

  it('renders validation errors', () => {
    const wrapper = shallowWithContext(<CreateOrUpdateDocument {...props} />);
    wrapper.setProps({validations: {
      title: 'This field is required'
    }});
    expect(wrapper.childAt(1).childAt(0).childAt(1).childAt(1).props().error)
      .to.equal('This field is required');
  });
});

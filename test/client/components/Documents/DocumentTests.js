import React from 'react';
import {shallowWithContext} from '../utils';
import {expect} from 'chai';
import sinon from 'sinon';

import Document from '../../../../client/src/components/Documents/Document';

describe('Document', () => {
  const props = {
    document: {
      _id: Math.random().toString(32),
      title: 'Test',
      content: 'test',
      role: {
        title: 'public'
      },
      owner: {
        role: {
          title: 'user'
        }
      },
      updatedAt: Date.now()
    },
    documentCrudOptions: {
      documentContent: {}
    },
    shouldWeAllowEditDocument: false
  };

  it('renders a document', () => {
    const wrapper = shallowWithContext(<Document {...props} />);
    expect(wrapper.childAt(0).childAt(1).props().title).to.eql('Test');
    expect(wrapper.childAt(0).childAt(2).childAt(0).text()).to.eql('test');
  });

  it('allows document editing', () => {
    const onUpdateThisDocument = sinon.spy();
    const wrapper = shallowWithContext(<Document {...props} />);
    wrapper.setProps({
      shouldWeAllowEditDocument: true,
      onUpdateThisDocument: onUpdateThisDocument
    });
    const IconMenu = wrapper.childAt(0).childAt(0).childAt(0);
    expect(IconMenu.is('IconMenu')).to.be.true;
    expect(IconMenu.childAt(0).props().primaryText).to.equal('Edit Document');
    IconMenu.childAt(0).simulate('touchTap');
    expect(onUpdateThisDocument.calledOnce).to.be.true;
  });

  it('allows document deletion', () => {
    const onDeleteDocument = sinon.spy();
    const wrapper = shallowWithContext(<Document {...props} />);
    wrapper.setProps({
      shouldWeAllowEditDocument: true,
      onDeleteDocument: onDeleteDocument
    });
    const IconMenu = wrapper.childAt(0).childAt(0).childAt(0);
    expect(IconMenu.is('IconMenu')).to.be.true;
    expect(IconMenu.childAt(1).props().primaryText).to.equal('Delete Document');
    IconMenu.childAt(1).simulate('touchTap');
    expect(onDeleteDocument.calledOnce).to.be.true;
  });

  it('shows a spinner when updating  a document', () => {
    const wrapper = shallowWithContext(<Document {...props} />);
    wrapper.setProps({
      shouldWeAllowEditDocument: true,
      documentCrudOptions: {
        isFetching: true,
        isUpdatingDocument: true,
        documentContent: {
          _id: props.document._id
        }
      }
    });
    expect(wrapper.childAt(0).childAt(0).childAt(0).is('CircularProgress'))
      .to.be.true;
  });
});

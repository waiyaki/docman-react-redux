import React from 'react';
import { shallowWithContext } from '../utils';
import { expect } from 'chai';
import sinon from 'sinon';

import UserSidebar from '../../../../client/src/components/UserSidebar/UserSidebar';

describe('UserSidebar', () => {
  const props = {
    handleToggleShowUpdate: () => {},
    userDetails: {
      user: {}
    }
  };

  it('renders a user profile card', () => {
    const wrapper = shallowWithContext(<UserSidebar {...props} />);
    expect(wrapper.find('Card')).to.be.length(1);
  });

  it('renders a card header with a user avatar', () => {
    const wrapper = shallowWithContext(<UserSidebar {...props} />);
    const CardHeader = wrapper.find('CardHeader');
    expect(CardHeader.props().avatar).to.match(/https:\/\/www.gravatar.com/);
  });

  it('renders an edit button when showing own profile', () => {
    const wrapper = shallowWithContext(<UserSidebar {...props} />);
    wrapper.setProps({
      isOwnProfileOrAdmin: true
    });
    const IconMenu = wrapper.find('IconMenu');
    expect(IconMenu).to.have.length(1);
    const MenuItem = wrapper.find('MenuItem');
    expect(MenuItem.props().primaryText).to.equal('Edit Profile');
  });

  it('toggles between showing profile and updating profile', () => {
    const handleToggleShowUpdate = sinon.spy();
    const wrapper = shallowWithContext(<UserSidebar {...props} />);
    wrapper.setProps({
      isOwnProfileOrAdmin: true,
      handleToggleShowUpdate
    });
    const MenuItem = wrapper.find('MenuItem');
    MenuItem.simulate('touchTap');
    expect(handleToggleShowUpdate.calledOnce).to.be.true;
  });
});

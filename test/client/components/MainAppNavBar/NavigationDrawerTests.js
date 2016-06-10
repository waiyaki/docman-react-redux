import React from 'react';
import {shallowWithContext} from '../utils';
import {expect} from 'chai';
import sinon from 'sinon';

import NavigationDrawer from '../../../../client/src/components/MainAppNavBar/NavigationDrawer';

describe('NavigationDrawer', () => {
  const props = {
    isDrawerOpen: true,
    onDrawerToggle: () => {},
    user: {
      username: 'testUser'
    }
  };

  it('renders a drawer', () => {
    const wrapper = shallowWithContext(<NavigationDrawer {...props}/>);
    expect(wrapper.find('Drawer')).to.have.length(1);
  });

  it('renders two menu items', () => {
    const wrapper = shallowWithContext(<NavigationDrawer {...props} />);
    expect(wrapper.find('MenuItem')).to.have.length(2);
  });

  it('renders a menu item with a link to the user profile page', () => {
    const wrapper = shallowWithContext(<NavigationDrawer {...props}/>);
    const userProfileLink = wrapper.find('Link').last();
    expect(userProfileLink.props().to).to.eql('/@testUser');
  });

  it('renders a menu item with a link to the home page', () => {
    const wrapper = shallowWithContext(<NavigationDrawer {...props}/>);
    const userProfileLink = wrapper.find('Link').first();
    expect(userProfileLink.props().to).to.eql('/');
  });

  it('toggles the drawer when a menu item is clicked', () => {
    const onDrawerToggle = sinon.spy();
    const wrapper = shallowWithContext(
      <NavigationDrawer {...props} onDrawerToggle={onDrawerToggle}/>
    );
    wrapper.find('MenuItem').first().simulate('touchTap');
    expect(onDrawerToggle.calledOnce).to.be.true;

    wrapper.find('MenuItem').last().simulate('touchTap');
    expect(onDrawerToggle.calledTwice).to.be.true;
  });
});

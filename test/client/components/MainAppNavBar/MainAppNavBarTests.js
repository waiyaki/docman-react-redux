import React from 'react';
import {shallowWithContext, mountWithContext} from '../utils';
import {expect} from 'chai';

import NavBar from '../../../../client/src/components/MainAppNavBar/MainAppNavBar';

describe('MainAppNavBar', () => {
  const props = {
    onDrawerToggle: () => {},
    onFilterChange: () => {},
    onLogout: () => {},
    userDetails: {
      user: {
        username: 'test',
        email: 'test@test.com'
      }
    }
  };

  it('renders a app bar', () => {
    const wrapper = shallowWithContext(<NavBar {...props}/>);
    expect(wrapper.childAt(0).is('AppBar')).to.be.true;
  });

  it('renders a menu icon on small screens', () => {
    const wrapper = shallowWithContext(<NavBar {...props}/>);
    expect(wrapper.childAt(0).props().iconElementLeft.props.className)
      .to.equal('hide-gt-sm');
  });

  it('renders a filter button', () => {
    const wrapper = shallowWithContext(<NavBar {...props}/>);
    const iconElementRight = wrapper.childAt(0).props().iconElementRight;
    expect(
      iconElementRight.props.children[0].props.iconButtonElement.props.tooltip
    ).to.equal('Documents Filter');
  });

  it('renders vertical navigation icon', () => {
    const wrapper = mountWithContext(<NavBar {...props}/>);
    expect(wrapper.find('NavigationMoreVert')).to.have.length(1);
  });
});

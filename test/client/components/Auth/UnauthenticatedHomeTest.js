import React from 'react';
import {mount} from 'enzyme';
import {expect} from 'chai';

import UnauthenticatedHomePage from '../../../../client/src/components/Auth/UnauthenticatedHomePage';
import {getContexts} from '../utils';

describe('Unauthenticate home page', () => {
  it('renders the login card by default', () => {
    const wrapper = mount(<UnauthenticatedHomePage />, getContexts());
    expect(wrapper.find('Login').length).to.be.equal(1);
  });

  it('renders the register card if props.isShowingLogin is false', () => {
    const wrapper = mount(
      <UnauthenticatedHomePage auth={{
        isShowingLogin: false,
        credentials: {},
        validations: {},
        isFetching: false
      }}
      />, getContexts()
    );
    expect(wrapper.find('Signup').length).to.be.equal(1);
  });
});

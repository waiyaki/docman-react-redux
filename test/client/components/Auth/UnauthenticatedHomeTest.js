import React from 'react';
import { expect } from 'chai';

// eslint-disable-next-line
import UnauthenticatedHomePage from '../../../../client/src/components/Auth/UnauthenticatedHomePage';
import { mountWithContext } from '../utils';

describe('Unauthenticate home page', () => {
  it('renders the login card by default', () => {
    const wrapper = mountWithContext(<UnauthenticatedHomePage />);
    expect(wrapper.find('Login').length).to.be.equal(1);
  });

  it('renders the register card if props.isShowingLogin is false', () => {
    const wrapper = mountWithContext(
      <UnauthenticatedHomePage
        auth={{
          isShowingLogin: false,
          credentials: {},
          validations: {},
          isFetching: false
        }}
      />
    );
    expect(wrapper.find('Signup').length).to.be.equal(1);
  });
});

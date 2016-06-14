import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import SignupPage from '../../../../client/src/components/Auth/SignupPage';
import { shallowWithContext, mountWithContext } from '../utils';

describe('Signup Page', () => {
  it('renders with a Signup title', () => {
    const wrapper = mountWithContext(<SignupPage />);
    expect(wrapper.text()).to.contain('Signup');
  });

  it('renders a username input field', () => {
    const wrapper = mountWithContext(<SignupPage />);
    expect(wrapper.text()).to.contain('Enter Username');
  });

  it('renders a password input field', () => {
    const wrapper = mountWithContext(<SignupPage />);
    expect(wrapper.text()).to.contain('Enter Password');
  });

  it('renders a confirm password input field', () => {
    const wrapper = mountWithContext(<SignupPage />);
    expect(wrapper.text()).to.contain('Confirm Password');
  });

  it('renders a email input field', () => {
    const wrapper = mountWithContext(<SignupPage />);
    expect(wrapper.text()).to.contain('Enter Email');
  });

  it('performs signup when the signup button is clicked', () => {
    const onAuthAction = sinon.stub();
    const wrapper = shallowWithContext(
      <SignupPage onAuthAction={onAuthAction} />);
    wrapper.childAt(2).childAt(0).simulate('click');
    expect(onAuthAction.calledOnce).to.be.true;
  });

  it('toggles the login view', () => {
    const toggleView = sinon.stub();
    const wrapper = shallowWithContext(
      <SignupPage handleToggleView={toggleView} />);
    wrapper
      .childAt(2)
      .childAt(1)
      .childAt(2)
      .simulate('click');
    expect(toggleView.calledOnce).to.be.true;
  });

  it('shows a loading animation when posting details to the server', () => {
    const wrapper = shallowWithContext(
      <SignupPage
        auth={{
          isFetching: true,
          credentials: {},
          validations: {}
        }}
      />);

    expect(wrapper.childAt(2).is('CircularProgress')).to.be.true;
  });

  it('shows validation errors when they occur', () => {
    const props = {
      auth: {
        validations: {
          username: 'This field is required'
        },
        credentials: {},
        isFetching: false
      }
    };

    const wrapper = shallowWithContext(<SignupPage {...props} />);
    const validationErr = wrapper
      .childAt(1)
      .childAt(0)
      .childAt(1)
      .childAt(1);
    expect(validationErr.is('ValidationError')).to.be.true;
    expect(validationErr.props().error).to.equal('This field is required');
  });
});

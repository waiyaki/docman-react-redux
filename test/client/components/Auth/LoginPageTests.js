import React from 'react';
import {shallow, mount} from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';

import {CardTitle} from 'material-ui/Card';

import LoginPage from '../../../../client/src/components/Auth/LoginPage';
import {getContexts} from '../utils';

const shallowWithContext = (node) => {
  return shallow(node, getContexts());
};

describe('Login Page', () => {
  it('renders with a Login title', () => {
    const wrapper = shallow(<LoginPage />);
    expect(wrapper.containsMatchingElement(
      <CardTitle title='Login'/>
    )).to.be.true;
  });

  it('renders a username text field', () => {
    const wrapper = mount(<LoginPage />, getContexts());
    expect(wrapper.text()).to.contain('Enter Username');
  });

  it('renders a password text field', () => {
    const wrapper = mount(<LoginPage />, getContexts());
    expect(wrapper.text()).to.contain('Enter Password');
  });

  it('performs login when the login button is clicked', () => {
    const onAuthAction = sinon.stub();
    const wrapper = shallowWithContext(
      <LoginPage onAuthAction={onAuthAction}/>);
    wrapper.childAt(2).childAt(0).simulate('click');
    expect(onAuthAction.calledOnce).to.be.true;
  });

  it('toggles registration view when register button is clicked', () => {
    const toggleView = sinon.stub();
    const wrapper = shallowWithContext(
      <LoginPage toggleView={toggleView}/>);
    wrapper.childAt(2).childAt(1).childAt(2).simulate('click');
    expect(toggleView.calledOnce).to.be.true;
  });

  it('shows a loading animation when posting details to the server', () => {
    const wrapper = shallowWithContext(
      <LoginPage auth={{
        isFetching: true,
        credentials: {},
        validations: {}
      }}
      />
    );
    expect(wrapper.childAt(2).is('CircularProgress')).to.be.true;
  });

  it('shows validation errors when they occur', () => {
    const props = {
      auth: {
        validations: {
          password: 'This field should be more than that number of characters'
        },
        credentials: {},
        isFetching: false
      }
    };

    const wrapper = shallowWithContext(<LoginPage {...props} />);
    const validationErr = wrapper.childAt(1).childAt(1).childAt(1).childAt(1);
    expect(validationErr.is('ValidationError')).to.be.true;
    expect(validationErr.props().error)
      .to.equal('This field should be more than that number of characters');
  });
});

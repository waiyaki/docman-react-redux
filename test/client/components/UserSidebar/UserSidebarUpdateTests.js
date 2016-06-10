import React from 'react';
import {shallowWithContext} from '../utils';
import {expect} from 'chai';
import sinon from 'sinon';

import UserSideBarUpdate from '../../../../client/src/components/UserSidebar/UserProfileUpdate';

describe('UserSideBarUpdate', () => {
  const props = {
    handleFieldUpdate: () => {},
    handleProfileUpdate: () => {},
    handleToggleShowUpdate: () => {},
    handleValidateFieldOnBlur: () => {},
    userDetails: {
      updatedUser: {},
      user: {
        username: 'test',
        role: {}
      },
      validations: {}
    }
  };

  it('renders a user profile update card', () => {
    const wrapper = shallowWithContext(<UserSideBarUpdate {...props} />);
    expect(wrapper.find('CardTitle').props().title)
      .to.equal('test - Profile Update');
  });

  it('renders username, email, firstName, lastName, password' +
     'and confirmPassword text fields', () => {
    const wrapper = shallowWithContext(<UserSideBarUpdate {...props} />);
    const textFields = wrapper.find('TextField');

    const expectedFields = [
      'username', 'email', 'firstName', 'lastName',
      'password', 'confirmPassword'
    ];

    textFields.nodes.forEach(node => {
      expect(!!~(expectedFields.indexOf(node.props.name))).to.be.true;
    });
  });

  it('renders validation errors', () => {
    const wrapper = shallowWithContext(<UserSideBarUpdate {...props} />);
    wrapper.setProps({
      userDetails: {
        updatedUser: {},
        user: {
          username: 'test',
          role: {}
        },
        validations: {
          email: 'This field is required.'
        }
      }
    });

    const validationError = wrapper.find('ValidationError').first();
    expect(validationError.props().error)
      .to.equal('This field is required.');
  });

  it('calls onChange handler when a field is updated', () => {
    const handleFieldUpdate = sinon.spy();
    const wrapper = shallowWithContext(<UserSideBarUpdate {...props} />);
    wrapper.setProps({
      handleFieldUpdate: handleFieldUpdate
    });
    const textField = wrapper.find('TextField').last();
    textField.simulate('change');
    expect(handleFieldUpdate.calledOnce).to.be.true;
  });

  it('validates on blur', () => {
    const handleValidateFieldOnBlur = sinon.spy();
    const wrapper = shallowWithContext(<UserSideBarUpdate {...props} />);
    wrapper.setProps({
      handleValidateFieldOnBlur: handleValidateFieldOnBlur
    });
    const textField = wrapper.find('TextField').last();
    textField.simulate('blur');
    expect(handleValidateFieldOnBlur.calledOnce).to.be.true;
  });

  it('has a disabled Update button if the data is invalid', () => {
    const wrapper = shallowWithContext(<UserSideBarUpdate {...props} />);
    const updateButton = wrapper.find('RaisedButton').first();
    expect(updateButton.props().disabled).to.be.true;

    wrapper.setProps({
      userDetails: {
        updatedUser: {},
        user: {
          username: 'test',
          role: {}
        },
        validations: {
          isValid: true
        }
      }
    });

    const updateButton2 = wrapper.find('RaisedButton').first();
    expect(updateButton2.props().disabled).to.be.false;
  });

  it('calls handleProfileUpdate when the update button is clicked', () => {
    const handleProfileUpdate = sinon.spy();
    const wrapper = shallowWithContext(<UserSideBarUpdate {...props} />);
    wrapper.setProps({
      handleProfileUpdate: handleProfileUpdate,
      userDetails: {
        updatedUser: {},
        user: {
          username: 'test',
          role: {}
        },
        validations: {
          isValid: true
        }
      }
    });

    const updateButton = wrapper.find('RaisedButton').first();
    updateButton.simulate('click');
    expect(handleProfileUpdate.calledOnce).to.be.true;
  });

  it('toggles showing the profile update', () => {
    const handleToggleShowUpdate = sinon.spy();
    const wrapper = shallowWithContext(<UserSideBarUpdate {...props} />);
    wrapper.setProps({
      handleToggleShowUpdate: handleToggleShowUpdate,
      userDetails: {
        updatedUser: {},
        user: {
          username: 'test',
          role: {}
        },
        validations: {
          isValid: true
        }
      }
    });
    const cancelButton = wrapper.find('RaisedButton').last();
    cancelButton.simulate('click');
    expect(handleToggleShowUpdate.calledOnce).to.be.true;
  });
});

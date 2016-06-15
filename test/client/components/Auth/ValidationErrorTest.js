import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import ValidationError from '../../../../client/src/components/Auth/ValidationError';

describe('ValidationError', () => {
  it('renders a validation error', () => {
    const wrapper = mount(<ValidationError error='This is some test error.' />);
    expect(wrapper.text()).to.equal('This is some test error.');
  });
});

import React from 'react';
import {shallowWithContext} from '../utils';
import {expect} from 'chai';

import Chip from '../../../../client/src/components/Documents/Chip';

describe('Chip', () => {
  const styles = {
    display: 'inline-block',
    padding: '0 0.8rem',
    marginRight: '.25rem',
    fontSize: '0.8rem',
    lineHeight: '1.4rem',
    color: '#757575',
    backgroundColor: '#eee',
    borderRadius: '3rem'
  };

  it('renders a chip', () => {
    const wrapper = shallowWithContext(<Chip content='public' />);
    expect(wrapper.props().style).to.eql(styles);
    expect(wrapper.text()).to.equal('public');
  });
});

import React from 'react';
import { shallowWithContext } from '../utils';
import { expect } from 'chai';

import Home from '../../../../client/src/components/Home/Home';

describe('Home', () => {
  const props = {
    userDetails: {
      user: {
        email: 'test@test.com',
        role: {
          title: 'user'
        },
        username: 'test'
      }
    }
  };

  it('renders the user sidebar and the documents container', () => {
    const wrapper = shallowWithContext(<Home {...props} />);
    expect(
      wrapper
        .childAt(1)
        .childAt(0)
        .childAt(0)
        .childAt(0)
        .is('Connect(UserSideBarContainer)'
      )
    ).to.be.true;
    expect(
      wrapper
      .childAt(1)
      .childAt(0)
      .childAt(1)
      .childAt(0)
      .is('Connect(DocumentsContainer)')
    ).to.be.true;
  });
});

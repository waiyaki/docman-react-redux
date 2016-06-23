import React from 'react';
import { shallowWithContext } from '../utils';
import { expect } from 'chai';

import ProfilePage from '../../../../client/src/components/ProfilePage/ProfilePage';

describe('Profile Page', () => {
  const props = {
    selectedUser: {
      profile: {
        user: {},
        fetchError: {}
      }
    }
  };

  it('renders a user sidebar', () => {
    const wrapper = shallowWithContext(<ProfilePage {...props} />);
    expect(wrapper.find('Connect(UserSideBarContainer)')).to.have.length(1);
  });

  it('renders a documents container', () => {
    const wrapper = shallowWithContext(<ProfilePage {...props} />);
    expect(wrapper.find('Connect(DocumentsContainer)')).to.have.length(1);
  });

  it('renders a loading animation on the user sidebar while fetching', () => {
    const wrapper = shallowWithContext(<ProfilePage {...props} />);
    wrapper.setProps({
      selectedUser: {
        profile: {
          isFetching: true,
          fetchError: {}
        }
      }
    });
    expect(wrapper.find('UserSidebarLoading')).to.have.length(1);
    expect(wrapper.find('CircularProgress')).to.have.length(1);
  });
});

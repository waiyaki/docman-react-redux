import React, { PropTypes } from 'react';
import classnames from 'classnames';

import CircularProgress from 'material-ui/CircularProgress';

import MainAppNavBarContainer from '../../containers/MainAppNavBar/MainAppNavBarContainer';
import UserSideBarContainer from '../../containers/UserSideBar/UserSideBarContainer';
import UserSidebarLoading from '../UserSidebar/UserSidebarLoading';
import DocumentsContainer from '../../containers/Documents/DocumentsContainer';
import NotFound from '../NotFound/NotFound';

const ProfilePage = (props) => {
  const profile = props.selectedUser.profile;

  function showSidebarContainer() {
    return !profile.fetchError.notFound && !profile.isFetching && (
      <UserSideBarContainer
        selectedUser={profile}
      />
    );
  }

  function showUserProfileHeader() {
    return !profile.fetchError.notFound && !profile.isFetching && (
      `${profile.user
          ? profile.user.username
          : props.selectedUser.username
        }'s Documents`
    );
  }

  function showUserDocuments() {
    return profile.fetchError.notFound && !profile.isFetching
    ? (
      <div className='col-xs-12 col-md-8 col-md-offset-2 col-lg-8 col-lg-offset-2'>
        <NotFound
          message={{
            heading: `Sorry, we couldn't find @${props.selectedUser.username}.`,
            description: 'That user may not exist or you may have the wrong username.'
          }}
        >
          <p>Please check the username and try again.</p>
        </NotFound>
      </div>)
    : (
      <DocumentsContainer
        selectedUser={profile.user}
        selectedUserDocuments={props.selectedUser.docs}
      />);
  }

  const columnClassnames = (prof) => classnames({
    'col-xs-12': true,
    'col-sm-8': true,
    [`col-sm-offset-${prof.fetchError.notFound ? 2 : 4}`]: true,
    [`col-lg-${prof.fetchError.notFound ? 10 : 9}`]: true,
    [`col-lg-offset-${prof.fetchError.notFound ? 1 : 3}`]: true
  });

  return (
    <div className='main-application__body'>
      <MainAppNavBarContainer />
      <div className='main-application__content margin-gt-md'>
        <div className='row' style={{ padding: '0 0 0 1em' }}>
          {profile.isFetching
          ?
            <UserSidebarLoading />
          :
            showSidebarContainer()
          }
          <div className={columnClassnames(profile)}>
            <div className='profile-header' zDepth={0}>
              {profile.isFetching
                ? <CircularProgress size={0.5} />
                : showUserProfileHeader()
              }
            </div>
            {showUserDocuments()}
          </div>
        </div>
      </div>
    </div>
  );
};

ProfilePage.propTypes = {
  selectedUser: PropTypes.shape({
    docs: PropTypes.shape({
      isFetching: PropTypes.bool.isRequired,
      documents: PropTypes.arrayOf(PropTypes.object)
    }),
    profile: PropTypes.shape({
      isFetching: PropTypes.bool.isRequired,
      user: PropTypes.shape({
        email: PropTypes.string,
        role: PropTypes.shape({
          accessLevel: PropTypes.number,
          title: PropTypes.string
        }),
        username: PropTypes.string
      })
    }),
    username: PropTypes.string.isRequired
  })
};

export default ProfilePage;

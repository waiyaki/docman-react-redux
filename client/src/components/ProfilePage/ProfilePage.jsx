import React, {PropTypes} from 'react';

import CircularProgress from 'material-ui/CircularProgress';

import MainAppNavBarContainer from '../../containers/MainAppNavBar/MainAppNavBarContainer';
import UserSideBarContainer from '../../containers/UserSideBar/UserSideBarContainer';
import UserSidebarLoading from '../UserSidebar/UserSidebarLoading';
import DocumentsContainer from '../../containers/Documents/DocumentsContainer';

const ProfilePage = (props) => {
  return (
    <div className='main-application__body'>
      <MainAppNavBarContainer />
      <div className='main-application__content margin-gt-md'>
        <div className='row'>
          <div className='col-xs-12 col-sm-4 col-lg-3'>
            {props.selectedUser.profile.isFetchingProfile
              ? <UserSidebarLoading />
              : <UserSideBarContainer
                  selectedUser={props.selectedUser.profile.user}
                />
            }
          </div>
          <div className='col-xs-12 col-sm-8 col-lg-9'>
            <div className='profile-header' zDepth={0}>
              {props.selectedUser.profile.isFetchingProfile
                ? <CircularProgress size={0.5} />
                : `${props.selectedUser.profile.user.username}'s Documents`
              }
            </div>
            <DocumentsContainer
              selectedUser={props.selectedUser.profile.user}
              selectedUserDocuments={props.selectedUser.docs}
            />
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
      isFetchingProfile: PropTypes.bool.isRequired,
      user: PropTypes.shape({
        email: PropTypes.string,
        role: PropTypes.shape({
          accessLevel: PropTypes.number,
          title: PropTypes.string
        }),
        username: PropTypes.string
      })
    })
  })
};

export default ProfilePage;

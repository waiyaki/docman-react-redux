import React, { PropTypes } from 'react';

import MainAppNavBarContainer from '../../containers/MainAppNavBar/MainAppNavBarContainer';
import UserSideBarContainer from '../../containers/UserSideBar/UserSideBarContainer';
import UserSidebarLoading from '../UserSidebar/UserSidebarLoading';
import DocumentsContainer from '../../containers/Documents/DocumentsContainer';

const Home = (props) => (
  <div className='main-application__body'>
    <MainAppNavBarContainer />
    <div className='main-application__content margin-gt-md'>
      <div
        className='row'
        style={{ padding: '0 0.5em 0 0.8em' }}
      >
        {props.userDetails.user
          ? <UserSideBarContainer />
          : <UserSidebarLoading />
        }
        <div className='col-xs-12 col-sm-offset-4 col-sm-8 col-lg-offset-3 col-lg-9'>
          <DocumentsContainer />
        </div>
      </div>
    </div>
  </div>
);

Home.propTypes = {
  userDetails: PropTypes.shape({
    user: PropTypes.shape({
      email: PropTypes.string,
      role: PropTypes.shape({
        accessLevel: PropTypes.number,
        title: PropTypes.string
      }),
      username: PropTypes.string
    })
  })
};

export default Home;

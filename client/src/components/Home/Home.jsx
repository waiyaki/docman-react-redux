import React, { PropTypes } from 'react';

import MainAppNavBarContainer from '../../containers/MainAppNavBar/MainAppNavBarContainer';
import UserSideBarContainer from '../../containers/UserSideBar/UserSideBarContainer';
import UserSidebarLoading from '../UserSidebar/UserSidebarLoading';
import DocumentsContainer from '../../containers/Documents/DocumentsContainer';

const Home = (props) => (
  <div className='main-application__body'>
    <MainAppNavBarContainer />
    <div className='main-application__content margin-gt-md'>
      <div className='row'>
        <div className='col-sm-4 col-lg-3 hide-sm-xs'>
          {props.userDetails.user
            ? <UserSideBarContainer />
            : <UserSidebarLoading />
          }
        </div>
        <div className='col-xs-12 col-sm-8 col-lg-9'>
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

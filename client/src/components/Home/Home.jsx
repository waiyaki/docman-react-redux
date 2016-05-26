import React, {PropTypes} from 'react';

import MainAppNavBar from './MainAppNavBar';
import UserSideBarContainer from '../../containers/UserSidebar/UserSideBarContainer';
import UserSidebarLoading from '../UserSidebar/UserSidebarLoading';

const Home = (props) => {
  return (
    <div className='main-application__body'>
      <MainAppNavBar
        onLogout={props.onLogout}
        userDetails={props.userDetails}
      />
      <div className='main-application__content margin-gt-md'>
        <div className='row'>
          <div className='col-sm-4 col-lg-3 hide-sm-xs'>
            {props.userDetails.user
              ? <UserSideBarContainer />
              : <UserSidebarLoading />
            }
          </div>
          <div className='col-sm-8 col-lg-9'>
            Hello World from the home component!
          </div>
        </div>
      </div>
    </div>
  );
};

Home.propTypes = {
  onLogout: PropTypes.func.isRequired,
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

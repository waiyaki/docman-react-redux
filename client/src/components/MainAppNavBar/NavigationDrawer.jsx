import React, {PropTypes} from 'react';
import {Link} from 'react-router';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import HomeIcon from 'material-ui/svg-icons/action/home';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';

const NavigationDrawer = (props) => {
  return (
    <Drawer
      docked={false}
      onRequestChange={props.onDrawerToggle}
      open={props.isDrawerOpen}
      width={200}
    >
      <MenuItem leftIcon={<HomeIcon />} onTouchTap={props.onDrawerToggle}>
        <Link
          activeStyle={{color: 'rgb(0, 188, 212)'}}
          className='username-link'
          to='/'
        >
          Home Page
        </Link>
      </MenuItem>
      <Divider />
      <MenuItem leftIcon={<AccountCircle />} onTouchTap={props.onDrawerToggle}>
        {props.user
          ? <Link
              activeStyle={{color: 'rgb(0, 188, 212)'}}
              className='username-link' to={`/@${props.user.username}`}
            >
                Your Profile
            </Link>
          : 'Your Profile'
        }
      </MenuItem>
      <Divider />
    </Drawer>
  );
};

NavigationDrawer.propTypes = {
  isDrawerOpen: PropTypes.bool.isRequired,
  onDrawerToggle: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired
  })
};

export default NavigationDrawer;

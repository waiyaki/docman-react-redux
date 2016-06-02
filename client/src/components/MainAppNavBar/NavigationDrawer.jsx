import React, {PropTypes} from 'react';
import {Link} from 'react-router';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

const NavigationDrawer = (props) => {
  return (
    <Drawer
      docked={false}
      onRequestChange={props.onDrawerToggle}
      open={props.isDrawerOpen}
      width={200}
    >
      <MenuItem onTouchTap={props.onDrawerToggle}>
        <Link
          activeStyle={{color: 'rgb(0, 188, 212)'}}
          className='username-link' to='/'
        >
          Home Page
        </Link>
      </MenuItem>
      <Divider />
      <MenuItem onTouchTap={props.onDrawerToggle}>
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

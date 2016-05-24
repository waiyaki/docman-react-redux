import React, {PropTypes} from 'react';

import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';

const NavBar = (props) => {
  return (
    <div className='main-application__navbar'>
      <AppBar
        iconElementLeft={
          <span className='hide-gt-sm'>
            <IconMenu
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              iconButtonElement={
                <IconButton iconStyle={{fill: 'white'}}>
                  <MenuIcon />
                </IconButton>
              }
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
            >
              <MenuItem
                primaryText={props.userDetails.user && props.userDetails.user.username
                  ? props.userDetails.user.username
                  : 'Profile'
                }
              />
              <MenuItem
                onTouchTap={props.onLogout}
                primaryText='Logout'
              />
            </IconMenu>
          </span>
        }
        iconElementRight={
          <IconMenu
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            iconButtonElement={
              <IconButton><MoreVertIcon /></IconButton>
            }
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            <MenuItem
              primaryText={props.userDetails.user && props.userDetails.user.username
                ? props.userDetails.user.username
                : 'Profile'
              }
            />
            <MenuItem
              onTouchTap={props.onLogout}
              primaryText='Logout'
            />
          </IconMenu>
        }
        title='Home'
        zDepth={0}
      />
    </div>
  );
};

NavBar.propTypes = {
  onLogout: PropTypes.func.isRequired,
  userDetails: PropTypes.shape({
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired
    })
  }).isRequired
};

export default NavBar;

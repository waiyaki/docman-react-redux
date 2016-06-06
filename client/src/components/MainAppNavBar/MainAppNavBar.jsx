import React, {PropTypes} from 'react';
import {Link} from 'react-router';

import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import ContentFilter from 'material-ui/svg-icons/content/filter-list';

const NavBar = (props) => {
  const FILTERS = ['all'].concat(['user', 'public', 'admin', 'private'].sort());
  return (
    <div className='main-application__navbar'>
      <AppBar
        iconElementLeft={
          <span className='hide-gt-sm'>
            <IconButton
              iconStyle={{fill: 'white'}}
              onTouchTap={props.onDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          </span>
        }
        iconElementRight={
          <span>
            <IconMenu
              iconButtonElement={
                <IconButton
                  iconStyle={{fill: 'white'}}
                  tooltip='Documents Filter'
                >
                  <ContentFilter />
                </IconButton>
              }
              onChange={props.onFilterChange}
              value={props.visibleFilter}
            >
              {FILTERS.map((role) => (
                <MenuItem
                  key={role}
                  primaryText={role}
                  value={role}
                />
              ))}
            </IconMenu>
            <IconMenu
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              iconButtonElement={
                <IconButton iconStyle={{fill: 'white'}}>
                  <MoreVertIcon />
                </IconButton>
              }
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
            >
                {props.userDetails.user && props.userDetails.user.username
                  ? <MenuItem>
                      <Link
                        activeStyle={{color: 'rgb(0, 188, 212)'}}
                        className='username-link' to={`/@${props.userDetails.user.username}`}
                      >
                        {props.userDetails.user.username}
                      </Link>
                    </MenuItem>
                  : null
                }
              <MenuItem
                onTouchTap={props.onLogout}
                primaryText='Logout'
              />
            </IconMenu>
          </span>
        }
        style={{position: 'fixed', top: 0}}
        title='DocMan'
      />
    </div>
  );
};

NavBar.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  userDetails: PropTypes.shape({
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired
    })
  }).isRequired,
  visibleFilter: PropTypes.string.isRequired
};

export default NavBar;

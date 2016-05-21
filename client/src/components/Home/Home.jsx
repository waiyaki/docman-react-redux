/* eslint-disable no-unused-vars */
import React from 'react';

import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
/* eslint-enable no-unused-vars */

export default function Home (props) {
  let auth = props.auth.toJS();
  return (
    <div className='main-application__body'>
      <div className='main-application__navbar'>
          <AppBar
            zDepth={0}
            title='Home'
            iconElementRight={
              <IconMenu
                iconButtonElement={
                  <IconButton><MoreVertIcon /></IconButton>
                }
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              >
                <MenuItem
                  primaryText={auth.user && auth.user.username
                    ? auth.user.username
                    : 'Profile'
                  }
                ></MenuItem>
                <MenuItem
                  onTouchTap={props.onLogout}
                  primaryText='Logout'
                ></MenuItem>
              </IconMenu>
            }
          ></AppBar>
      </div>
      <div className='main-application__content'>
        Hello World from the home component!
      </div>
    </div>
  );
}

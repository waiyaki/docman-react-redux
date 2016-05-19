import React from 'react';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

export default class MainContainer extends React.Component {
  render () {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div className='main-application'>
          <div className='main-application__navbar'>
                <AppBar zDepth={0}></AppBar>
          </div>
          <div className='main-application__body'>
            {this.props.children}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

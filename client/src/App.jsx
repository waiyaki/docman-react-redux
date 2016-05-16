import React from 'react';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

export default class App extends React.Component {
  render () {
    return (
      <div className='main-application'>
        <div className='main-application__navbar'>
          <MuiThemeProvider muiTheme={getMuiTheme()}>
              <AppBar zDepth={0}></AppBar>
          </MuiThemeProvider>
        </div>
        <div className='main-application__body'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

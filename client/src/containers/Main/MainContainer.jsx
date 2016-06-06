import React from 'react';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {blueA400} from 'material-ui/styles/colors';

import SnackBarContainer from '../Utils/SnackBarContainer';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#0055FF'
  }
});

export default class MainContainer extends React.Component {
  render () {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className='main-application'>
          {this.props.children}
          <SnackBarContainer />
        </div>
      </MuiThemeProvider>
    );
  }
}

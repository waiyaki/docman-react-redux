import React from 'react';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import SnackBarContainer from '../Utils/SnackBarContainer';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#0055FF'
  }
});

const MainContainer = (props) => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <div className='main-application'>
      {props.children}
      <SnackBarContainer />
    </div>
  </MuiThemeProvider>
);

MainContainer.propTypes = {
  children: React.PropTypes.node
};

export default MainContainer;

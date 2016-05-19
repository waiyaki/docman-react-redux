/* eslint-disable no-unused-vars */
import React from 'react';

import AppBar from 'material-ui/AppBar';
/* eslint-enable no-unused-vars */

export default function Home (props) {
  return (
    <div className='main-application__body'>
      <div className='main-application__navbar'>
          <AppBar zDepth={0} title='Home'></AppBar>
      </div>
      <div className='main-application__content'>
        Hello World from the home component!
      </div>
    </div>
  );
}

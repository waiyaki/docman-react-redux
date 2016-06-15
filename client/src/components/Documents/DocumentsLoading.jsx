import React from 'react';

import CircularProgress from 'material-ui/CircularProgress';

export default function DocumentsLoading() {
  return (
    <div className='row center-xs'>
      <div className='col-xs-6'>
        <div className='box'>
          <CircularProgress />
        </div>
      </div>
    </div>
  );
}

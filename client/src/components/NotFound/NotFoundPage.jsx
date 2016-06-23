import React from 'react';

import AppBar from 'material-ui/AppBar';

import NotFound from './NotFound';

const NotFoundPage = () => (
  <div>
    <AppBar
      iconElementLeft={<span></span>}
      style={{ position: 'fixed', top: 0 }}
      title='DocMan'
    />
    <div
      className='row'
      style={{
        paddingTop: '75px',
        margin: '0 0.5em 0 0.5em'
      }}
    >
      <div className='col-xs-12 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3'>
        <NotFound
          message={{}}
        >
          <h1 className='not-found-404'>404: Page Not Found.</h1>
          <h3>We couldn't find the page you're looking for.</h3>
          <p>Please check the url and try again.</p>
        </NotFound>
      </div>
    </div>
  </div>
);

export default NotFoundPage;

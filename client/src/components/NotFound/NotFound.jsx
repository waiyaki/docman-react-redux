import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

function NotFound(props) {
  const message = {
    heading: "This is not the page you're looking for.",
    description: "The page you're looking for has disappeared into the ether!"
  };

  if (props.message) {
    message.heading = props.message.heading;
    message.description = props.message.description;
  }
  return (
    <div className='box center not-found'>
      <Paper
        rounded
        style={{
          padding: '3em'
        }}
        zDepth={2}
      >
        <h1 className='not-found-heading'>
          {message.heading}
        </h1>
        <h3>
          {message.description}
        </h3>
        {props.children}
        <div className='not-found-home-link'>
          <RaisedButton
            label='Go to the homepage instead'
            labelStyle={{
              fontSize: '16px'
            }}
            onClick={() => browserHistory.push('/')}
            primary
          />
        </div>
      </Paper>
    </div>
  );
}

NotFound.propTypes = {
  children: PropTypes.node,
  message: PropTypes.shape({
    description: PropTypes.string,
    heading: PropTypes.string
  })
};

export default NotFound;

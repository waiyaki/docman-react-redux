import React from 'react'; // eslint-disable-line

const errorStyle = {
  fontSize: '0.8em',
  color: 'red'
};

const ValidationError = (props) => {
  return (
    <span style={errorStyle}>{props.error}</span>
  );
};

export default ValidationError;

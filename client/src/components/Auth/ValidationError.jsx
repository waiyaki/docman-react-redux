import React from 'react'; // eslint-disable-line

const errorStyle = {
  fontSize: '0.8em',
  color: 'red'
};

const ValidationError = (props) => (
  <span style={errorStyle}>{props.error}</span>
);

ValidationError.propTypes = {
  error: React.PropTypes.string
};

export default ValidationError;

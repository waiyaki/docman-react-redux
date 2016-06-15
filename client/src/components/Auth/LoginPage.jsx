import classNames from 'classnames';

/* eslint-disable no-unused-vars */
import React, { PropTypes } from 'react';

import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';

import ValidationError from './ValidationError';
/* eslint-enable no-unused-vars */

const Login = (props) => {
  const hideComponent = (item) => classNames({
    hidden: props.auth.validations[item]
  });

  return (
    <Card>
      <CardTitle title='Login' />
      <CardText>
        <div>
          <TextField
            floatingLabelText='Username'
            hintText='Enter Username'
            name='username'
            onBlur={props.onValidateField}
            onChange={props.onFieldUpdate}
            type='text'
            value={props.auth.credentials.username}
          />
          <span>
            <br />
            <ValidationError
              error={props.auth.validations.username}
              style={hideComponent('username')}
            />
          </span>
        </div>
        <div>
          <TextField
            floatingLabelText='Password'
            hintText='Enter Password'
            name='password'
            onBlur={props.onValidateField}
            onChange={props.onFieldUpdate}
            type='password'
            value={props.auth.credentials.password}
          />
          <span>
            <br />
            <ValidationError
              error={props.auth.validations.password}
              style={hideComponent('password')}
            />
          </span>
        </div>
      </CardText>
      {props.auth.isFetching
        ? <CircularProgress size={0.5} />
        : <CardActions>
            {props.errors
              ? props.errors.map(item => (
                <p key={item}>
                  <ValidationError error={item} />
                </p>
              ))
              : null
            }
          <RaisedButton
            className='login-btn'
            disabled={!props.auth.validations.isValid}
            label='Login'
            onClick={props.onAuthAction}
            primary
            style={{ zIndex: 6 }}
          />
          <div>
            Not Registered? <br />
            <FlatButton
              className='toggle-register'
              label='Register'
              onClick={props.handleToggleView}
            />
          </div>
        </CardActions>
      }
    </Card>
  );
};

Login.defaultProps = {
  auth: {
    isFetching: false,
    credentials: {},
    validations: {}
  }
};

Login.propTypes = {
  auth: PropTypes.shape({
    isFetching: PropTypes.bool.isRequired,
    credentials: PropTypes.object.isRequired,
    validations: PropTypes.shape({
      username: PropTypes.string,
      password: PropTypes.string,
      isValid: PropTypes.bool.isRequired
    })
  }).isRequired,
  errors: PropTypes.array, // eslint-disable-line
  handleToggleView: PropTypes.func.isRequired,
  onAuthAction: PropTypes.func.isRequired,
  onFieldUpdate: PropTypes.func.isRequired,
  onValidateField: PropTypes.func.isRequired
};

export default Login;

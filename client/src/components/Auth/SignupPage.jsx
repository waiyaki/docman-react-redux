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

const Signup = (props) => {
  const hideComponent = (item) => classNames({
    hidden: props.auth.validations[item]
  });

  return (
    <Card>
      <CardTitle title='Signup' />
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
            floatingLabelText='Email'
            hintText='Enter Email'
            name='email'
            onBlur={props.onValidateField}
            onChange={props.onFieldUpdate}
            type='email'
            value={props.auth.credentials.email}
          />
          <span>
            <br />
            <ValidationError
              error={props.auth.validations.email}
              style={hideComponent('email')}
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
        <div>
          <TextField
            floatingLabelText='Confirm Password'
            hintText='Enter Password'
            name='confirmPassword'
            onBlur={props.onValidateField}
            onChange={props.onFieldUpdate}
            type='password'
            value={props.auth.credentials.confirmPassword}
          />
          <span>
            <br />
            <ValidationError
              error={props.auth.validations.confirmPassword}
              style={hideComponent('confirmPassword')}
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
            disabled={!props.auth.validations.isValid}
            label='Signup'
            onClick={props.onAuthAction}
            primary
          />
          <div>
            Already Registered?<br />
            <FlatButton
              label='Login'
              onClick={props.handleToggleView}
            />
          </div>
        </CardActions>
      }
    </Card>
  );
};

Signup.defaultProps = {
  auth: {
    isFetching: false,
    credentials: {},
    validations: {}
  }
};

Signup.propTypes = {
  auth: PropTypes.shape({
    isFetching: PropTypes.bool.isRequired,
    credentials: PropTypes.object.isRequired,
    validations: PropTypes.shape({
      confirmPassword: PropTypes.string,
      email: PropTypes.string,
      isValid: PropTypes.bool.isRequired,
      password: PropTypes.string,
      username: PropTypes.string
    })
  }).isRequired,
  errors: PropTypes.array, // eslint-disable-line
  handleToggleView: PropTypes.func.isRequired,
  onAuthAction: PropTypes.func.isRequired,
  onFieldUpdate: PropTypes.func.isRequired,
  onValidateField: PropTypes.func.isRequired
};

export default Signup;

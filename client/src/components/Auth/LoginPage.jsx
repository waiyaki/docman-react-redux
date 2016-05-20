import classNames from 'classnames';

/* eslint-disable no-unused-vars */
import React, {PropTypes} from 'react';

import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';

import ValidationError from './ValidationError';
/* eslint-enable no-unused-vars */

const Login = (props) => {
  let hideComponent = (item) => {
    return classNames({
      hidden: props.auth.validations[item]
    });
  };

  return (
    <Card>
      <CardTitle title='Login'/>
      <CardText>
        <div>
          <TextField
            hintText='Enter Username'
            floatingLabelText='Username'
            name='username'
            type='text'
            required
            onChange={props.onFieldUpdate}
            onBlur={props.onValidateField}
            value={props.auth.credentials.username}
          />
          <span>
            <br />
            <ValidationError
              style={hideComponent('username')}
              error={props.auth.validations.username}
            ></ValidationError>
          </span>
        </div>
        <div>
          <TextField
            hintText='Enter Password'
            floatingLabelText='Password'
            name='password'
            type='password'
            required
            onChange={props.onFieldUpdate}
            onBlur={props.onValidateField}
            value={props.auth.credentials.password}
          />
          <span>
            <br />
            <ValidationError
              style={hideComponent('password')}
              error={props.auth.validations.password}
            ></ValidationError>
          </span>
        </div>
      </CardText>
      {props.auth.isFetching
        ? <CircularProgress size={0.5}/>
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
            backgroundColor='#00BCD4'
            label='Login'
            onClick={props.onAuthAction}
            disabled={!props.auth.validations.isValid}
            />
          <p>
            Not Registered? <br />
            <RaisedButton
              label='Register'
              onClick={props.toggleView}
            />
          </p>
          </CardActions>
      }
    </Card>
  );
};

Login.propTypes = {
  onAuthAction: PropTypes.func.isRequired,
  onFieldUpdate: PropTypes.func.isRequired,
  toggleView: PropTypes.func.isRequired,
  auth: PropTypes.shape({
    isFetching: PropTypes.bool.isRequired,
    credentials: PropTypes.object.isRequired
  }).isRequired,
  errors: PropTypes.array,
  onValidateField: PropTypes.func.isRequired
};

export default Login;

/* eslint-disable no-unused-vars */
import React, {PropTypes} from 'react';

import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
/* eslint-enable no-unused-vars */

const errorStyle = {
  fontSize: '0.8em',
  color: 'red'
};

const Signup = (props) => {
  return (
    <Card>
      <CardTitle title='Signup'/>
      <CardText>
        <TextField
          hintText='Enter Username'
          floatingLabelText='Username'
          name='username'
          type='text'
          onChange={props.onFieldUpdate}
          value={props.auth.credentials.username}
        />
        <br />
        <TextField
          hintText='Enter Email'
          floatingLabelText='Email'
          name='email'
          type='email'
          onChange={props.onFieldUpdate}
          value={props.auth.credentials.email}
        />
        <br />
        <TextField
          hintText='Enter Password'
          floatingLabelText='Password'
          name='password'
          type='password'
          onChange={props.onFieldUpdate}
          value={props.auth.credentials.password}
        />
        <br />
        <TextField
          hintText='Confirm Password'
          floatingLabelText='Confirm Password'
          name='confirmPassword'
          type='password'
          onChange={props.onFieldUpdate}
        />
      </CardText>
      {props.auth.isFetching
        ? <CircularProgress size={0.5}/>
        : <CardActions>
          {props.errors
            ? props.errors.map(item => (
              <p style={errorStyle} key={item}>{item}</p>))
            : null
          }
          <RaisedButton
            backgroundColor='#00BCD4'
            label='Signup'
            onClick={props.onAuthAction}
            />
            <p>
              Already Registered?<br />
              <RaisedButton
                label='Login'
                onClick={props.toggleView}
              />
            </p>
          </CardActions>
      }
    </Card>
  );
};

Signup.propTypes = {
  onAuthAction: PropTypes.func.isRequired,
  onFieldUpdate: PropTypes.func.isRequired,
  toggleView: PropTypes.func.isRequired,
  auth: PropTypes.shape({
    isFetching: PropTypes.bool.isRequired,
    credentials: PropTypes.object.isRequired
  }).isRequired,
  errors: PropTypes.array
};

export default Signup;

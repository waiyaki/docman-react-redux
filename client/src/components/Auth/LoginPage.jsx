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

const Login = (props) => {
  return (
    <Card>
      <CardTitle title='Login'/>
      <CardText>
        <TextField
          hintText='Enter Username'
          floatingLabelText='Username'
          name='username'
          type='text'
          required
          onChange={props.onFieldUpdate}
        /><br />
        <TextField
          hintText='Enter Password'
          floatingLabelText='Password'
          name='password'
          type='password'
          required
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
            label='Login'
            onClick={props.onAuthAction}
            />
          <p>
            <RaisedButton
              label='Or Register'
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
  auth: PropTypes.object.isRequired,
  errors: PropTypes.array
};

export default Login;

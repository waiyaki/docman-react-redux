/* eslint-disable no-unused-vars */
import React from 'react';

import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
/* eslint-enable no-unused-vars */

const Login = () => (
  <div className='row'>
    <div className='col-xs-12 col-sm-offset-2 col-sm-8 col-md-offset-3 col-lg-offset-4 col-md-6 col-lg-4'>
        <div className='box center'>
          <Card>
            <CardTitle title='Login'/>
            <CardText>
              <TextField
                hintText='Enter Username'
                floatingLabelText='Username'
                type='text'
              /><br />
              <TextField
                hintText='Enter Password'
                floatingLabelText='Password'
                type='password'
              />
            </CardText>
            <CardActions>
              <RaisedButton primary={true} label='Login' />
            </CardActions>
          </Card>
        </div>
    </div>
  </div>
);

export default Login;

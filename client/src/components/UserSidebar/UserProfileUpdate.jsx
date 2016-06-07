import md5 from 'blueimp-md5';
import classNames from 'classnames';

import React, {PropTypes} from 'react';

import {Card, CardActions, CardHeader, CardText, CardTitle} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import ValidationError from '../Auth/ValidationError';

const UserSideBarUpdate = (props) => {
  const user = props.userDetails.user;
  const userGravatar =
    `https://www.gravatar.com/avatar/${user ? md5(user.email) : ''}?d=identicon`;

  let hideComponent = (item) => {
    return classNames({
      hidden: props.userDetails.validations[item]
    });
  };

  return (
    <div className='sidebar'>
      <Card className='sidebar-card' zDepth={3}>
        <CardHeader
          avatar={userGravatar + '&s=40'}
          subtitle={user && user.role ? user.role.title : ''}
          title={user.name
            ? `${user.name.firstName + ' ' + user.name.lastName}`
            : user.username
          }
        />
        <CardTitle
          subtitle={user ? user.email : ''}
          title={`${user ? user.username + ' - ' : ''}Profile Update`}
        />
        <CardText className='center'>
          <div>
            <TextField
              disabled
              floatingLabelText='Username'
              name='username'
              type='text'
              value={user.username}
            />
          </div>
          <div>
            <TextField
              floatingLabelText='Email'
              name='email'
              onBlur={props.handleValidateFieldOnBlur}
              onChange={props.handleFieldUpdate}
              type='email'
              value={props.userDetails.updatedUser.email || user.email}
            />
            <span>
              <br />
              <ValidationError
                error={props.userDetails.validations.email}
                style={hideComponent('email')}
              />
            </span>
          </div>
          <div>
            <TextField
              floatingLabelText='First Name'
              name='firstName'
              onChange={props.handleFieldUpdate}
              type='text'
              value={props.userDetails.updatedUser.firstName || (user.name
                ? user.name.firstName : '')
              }
            />
            <span>
              <br />
              <ValidationError
                error={props.userDetails.validations.firstName}
                style={hideComponent('firstName')}
              />
            </span>
          </div>
          <div>
            <TextField
              floatingLabelText='Last Name'
              name='lastName'
              onChange={props.handleFieldUpdate}
              type='text'
              value={props.userDetails.updatedUser.lastName || (user.name
                ? user.name.lastName : '')
              }
            />
            <span>
              <br />
              <ValidationError
                error={props.userDetails.validations.lastName}
                style={hideComponent('lastName')}
              />
            </span>
          </div>
          <div>
            <TextField
              floatingLabelText='Password'
              name='password'
              onBlur={props.handleValidateFieldOnBlur}
              onChange={props.handleFieldUpdate}
              type='password'
            />
            <span>
              <br />
              <ValidationError
                error={props.userDetails.validations.password}
                style={hideComponent('password')}
              />
            </span>
          </div>
          <div>
            <TextField
              floatingLabelText='Confirm Password'
              name='confirmPassword'
              onBlur={props.handleValidateFieldOnBlur}
              onChange={props.handleFieldUpdate}
              type='password'
            />
            <span>
              <br />
              <ValidationError
                error={props.userDetails.validations.confirmPassword}
                style={hideComponent('confirmPassword')}
              />
            </span>
          </div>
        </CardText>
        {props.userDetails.isFetching
          ? <div className='center'><CircularProgress size={0.5}/></div>
          : <CardActions className='center'>
              {props.errors
                ? props.errors.map(item => (
                  <p key={item}>
                    <ValidationError error={item} />
                  </p>
                ))
                : null
              }
              <RaisedButton
                disabled={!props.userDetails.validations.isValid}
                label='Update'
                onClick={props.handleProfileUpdate}
                primary
              />
              <RaisedButton
                label='Cancel'
                onClick={props.handleToggleShowUpdate}
              />
            </CardActions>
        }
      </Card>
    </div>
  );
};

UserSideBarUpdate.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.object),
  handleFieldUpdate: PropTypes.func.isRequired,
  handleProfileUpdate: PropTypes.func.isRequired,
  handleToggleShowUpdate: PropTypes.func.isRequired,
  handleValidateFieldOnBlur: PropTypes.func.isRequired,
  userDetails: PropTypes.shape({
    isFetching: PropTypes.bool.isRequired,
    updatedUser: PropTypes.object,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      role: PropTypes.shape({
        accessLevel: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    validations: PropTypes.object
  }).isRequired
};

export default UserSideBarUpdate;

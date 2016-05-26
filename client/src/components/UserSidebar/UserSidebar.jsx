import md5 from 'blueimp-md5';

import React, {PropTypes} from 'react';

import {
  Card, CardActions, CardHeader, CardMedia, CardTitle
} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Edit from 'material-ui/svg-icons/image/edit';

const UserSidebar = (props) => {
  const user = props.userDetails.user;
  const userGravatar =
    `http://www.gravatar.com/avatar/${user ? md5(user.email) : ''}?d=identicon`;

  return (
    <div className='sidebar'>
      <Card className='sidebar-card' zDepth={0}>
        <CardHeader
          avatar={userGravatar + '&s=40'}
          subtitle={user && user.role ? user.role.title : ''}
          title={user.name
            ? `${user.name.firstName + ' ' + user.name.lastName}`
            : user.username
          }
        />
        <CardMedia
          overlay={
            <CardTitle
              subtitle={user.name
                ? `${user.name.firstName + ' ' + user.name.lastName}`
                : user.username
              }
            />
          }
        >
          <img src={userGravatar + '&s=300'} />
        </CardMedia>
        <CardTitle
          subtitle={user ? user.email : ''}
          title={user ? user.username : ''}
        />
        <CardActions>
          <FlatButton
            icon={<Edit />}
            label='Edit'
            onClick={props.handleToggleShowUpdate}
          />
        </CardActions>
      </Card>
    </div>
  );
};

UserSidebar.propTypes = {
  handleToggleShowUpdate: PropTypes.func.isRequired,
  userDetails: PropTypes.shape({
    user: PropTypes.shape({
      email: PropTypes.string.isRequired,
      role: PropTypes.shape({
        accessLevel: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired
      }),
      username: PropTypes.string.isRequired
    })
  }).isRequired
};

export default UserSidebar;
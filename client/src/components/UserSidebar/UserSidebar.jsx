import md5 from 'blueimp-md5';

import React, {PropTypes} from 'react';

import {Card, CardHeader, CardMedia, CardTitle} from 'material-ui/Card';

const UserSidebar = (props) => {
  var userGravatar =
    `http://www.gravatar.com/avatar/${props.user ? md5(props.user.email) : ''}?d=identicon`;
  return (
    <div className='sidebar'>
      <Card className='sidebar-card' zDepth={0}>
        <CardHeader
          avatar={userGravatar + '&s=40'}
          subtitle={props.user && props.user.role ? props.user.role.title : ''}
          title={props.user ? props.user.username : ''}
        />
        <CardMedia
          overlay={
            <CardTitle
              subtitle={props.user ? props.user.username : ''}
            />
          }
        >
          <img src={userGravatar + '&s=300'} />
        </CardMedia>
        <CardTitle
          subtitle={props.user ? props.user.email : ''}
          title={props.user ? props.user.username : ''}
        />
      </Card>
    </div>
  );
};

UserSidebar.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.shape({
      accessLevel: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired
    })
  })
};

export default UserSidebar;

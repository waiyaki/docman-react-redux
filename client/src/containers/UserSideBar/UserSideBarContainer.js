import { Map } from 'immutable';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  toggleShowUserUpdateView, userDetailsFieldUpdate, updateUserDetails,
  updateAnotherUsersProfile, anotherUserDetailsFieldUpdate
} from '../../actions/UserDetailsActions';
import {
  validateUserDetailsField, validateAnotherUserDetailsField
} from '../../actions/ValidationActions';
import UserSideBar from '../../components/UserSidebar/UserSidebar';
import UserSideBarUpdate from '../../components/UserSidebar/UserProfileUpdate';

class UserSideBarContainer extends React.Component {
  constructor(props) {
    super(props);

    this.isAdmin = this.isAdmin.bind(this);
    this.isOwnProfile = this.isOwnProfile.bind(this);
    this.resolveUserDetails = this.resolveUserDetails.bind(this);
    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.onRoleFieldUpdate = this.onRoleFieldUpdate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onToggleShowUpdateView = this.onToggleShowUpdateView.bind(this);
  }

  onFieldUpdate(event, name, value) {
    event.preventDefault();
    const fieldName = name === event.target.value ? event.target.name : name;
    const fieldValue = value || event.target.value;
    let updatedUser = this.resolveUserDetails().updatedUser;
    updatedUser = Object.assign({}, updatedUser, {
      [fieldName]: fieldValue
    });
    if (this.isOwnProfile()) {
      this.props.dispatch(userDetailsFieldUpdate(updatedUser));
      this.props.dispatch(validateUserDetailsField(fieldName));
    } else {
      this.props.dispatch(anotherUserDetailsFieldUpdate(updatedUser));
      this.props.dispatch(validateAnotherUserDetailsField(fieldName));
    }
  }

  onSubmit() {
    if (this.isOwnProfile()) {
      this.props.dispatch(
        updateUserDetails(this.resolveUserDetails().updatedUser)
      );
    } else {
      this.props.dispatch(
        updateAnotherUsersProfile(this.resolveUserDetails().updatedUser)
      );
    }
  }

  /**
   * Toggle between showing the user details view and update user details view.
   */
  onToggleShowUpdateView() {
    this.props.dispatch(toggleShowUserUpdateView());
  }

  onRoleFieldUpdate(event, index, value) {
    this.onFieldUpdate(event, 'role', value);
  }

  isOwnProfile() {
    return this.props.selectedUser
      ? this.props.selectedUser.user.username === this.props.userDetails
          .getIn(['user', 'username'])
      : true;
  }

  isAdmin() {
    const auth = this.props.auth;
    return auth.get('user').role && auth.get('user').role.title === 'admin';
  }

  /**
   * Figure out whether we're updating our own profile or we are admins
   * updating other users' profiles.
   */
  resolveUserDetails() {
    if (this.isOwnProfile()) {
      return this.props.userDetails.toJS();
    }
    return this.props.selectedUser && this.isAdmin()
      ? this.props.selectedUser
      : this.props.userDetails.toJS();
  }

  render() {
    // Render the sidebar with the user we got as props from the mounting
    // component, else use the user we've requested for from the state.
    return (
      this.props.userDetails.get('isShowingUpdate') &&
      (this.isOwnProfile() || this.isAdmin())
      ?
        <UserSideBarUpdate
          handleFieldUpdate={this.onFieldUpdate}
          handleProfileUpdate={this.onSubmit}
          handleRoleFieldUpdate={this.onRoleFieldUpdate}
          handleToggleShowUpdate={this.onToggleShowUpdateView}
          isAdmin={this.isAdmin()}
          userDetails={this.resolveUserDetails()}
        />
      :
        <UserSideBar
          handleToggleShowUpdate={this.onToggleShowUpdateView}
          isOwnProfileOrAdmin={this.isOwnProfile() || this.isAdmin()}
          userDetails={this.props.selectedUser
              ? this.props.selectedUser
              : this.props.userDetails.toJS()
            }
        />
    );
  }
}

UserSideBarContainer.propTypes = {
  auth: (props, propName, componentName) => {
    if (!props[propName] instanceof Map) {
      return new Error(
        `Invalid prop ${propName} supplied to ${componentName}.` +
        'Expected `Immutable.Map`'
      );
    }
    return undefined;
  },
  dispatch: PropTypes.func.isRequired,
  selectedUser: PropTypes.shape({
    user: PropTypes.shape({
      username: PropTypes.string,
      email: PropTypes.string,
      role: PropTypes.shape({
        title: PropTypes.string
      })
    })
  }),
  userDetails: (props, propName, componentName) => {
    if (!props[propName] instanceof Map) {
      return new Error(
        `Invalid prop ${propName} supplied to ${componentName}.` +
        'Expected `Immutable.Map`'
      );
    }
    return undefined;
  }
};

function mapStateToProps(state) {
  const { dispatch } = state;
  const auth = state.get('auth');
  const userDetails = state.get('userDetails');

  return {
    auth,
    dispatch,
    userDetails
  };
}

export default connect(mapStateToProps)(UserSideBarContainer);

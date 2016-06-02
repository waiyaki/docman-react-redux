import {Map} from 'immutable';

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import {
  toggleShowUserUpdateView, userDetailsFieldUpdate, updateUserDetails
} from '../../actions/UserDetailsActions';
import {validateUserDetailsField} from '../../actions/ValidationActions';
import UserSideBar from '../../components/UserSidebar/UserSideBar';
import UserSideBarUpdate from '../../components/UserSidebar/UserProfileUpdate';

class UserSideBarContainer extends React.Component {
  constructor (props) {
    super(props);

    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onToggleShowUpdateView = this.onToggleShowUpdateView.bind(this);
    this.onValidateFieldOnBlur = this.onValidateFieldOnBlur.bind(this);
  }

  onFieldUpdate (event) {
    event.preventDefault();
    let updatedUser = this.props.userDetails.get('updatedUser');
    updatedUser = updatedUser.set(event.target.name, event.target.value);
    this.props.dispatch(userDetailsFieldUpdate(updatedUser.toJS()));
    this.props.dispatch(validateUserDetailsField(event.target.name));
  }

  onSubmit () {
    this.props.dispatch(
      updateUserDetails(this.props.userDetails.get('updatedUser').toJS()));
  }

  /**
   * Toggle between showing the user details view and update user details view.
   */
  onToggleShowUpdateView () {
    this.props.dispatch(toggleShowUserUpdateView());
  }

  /**
   * Validate input fields on blur. Only run the validation if the field was
   * not valid even after having run the validations when something changed in
   * that field.
   *
   * This method also enables us to validate the fields after a user enters
   * the field then leaves without entering anything (touched field).
   */
  onValidateFieldOnBlur (event) {
    event.preventDefault();
    this.props.dispatch(validateUserDetailsField(event.target.name));
  }

  render () {
    // Render the sidebar with the user we got as props from the mounting
    // component, else use the user we've requested for from the state.
    return (
      this.props.userDetails.get('isShowingUpdate')
        ? <UserSideBarUpdate
            handleFieldUpdate={this.onFieldUpdate}
            handleProfileUpdate={this.onSubmit}
            handleToggleShowUpdate={this.onToggleShowUpdateView}
            handleValidateFieldOnBlur={this.onValidateFieldOnBlur}
            userDetails={this.props.userDetails.toJS()}
          />
        : <UserSideBar
            handleToggleShowUpdate={this.onToggleShowUpdateView}
            isOwnProfile={this.props.selectedUser
              ? this.props.selectedUser.username === this.props.userDetails
                  .getIn(['user', 'username'])
              : true
            }
            userDetails={this.props.selectedUser
              ? {user: this.props.selectedUser}
              : this.props.userDetails.toJS()
            }
          />
    );
  }
};

UserSideBarContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  selectedUser: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.shape({
      title: PropTypes.string
    })
  }),
  userDetails: function (props, propName, componentName) {
    if (!props[propName] instanceof Map) {
      return new Error(
        `Invalid prop ${propName} supplied to ${componentName}.` +
        'Expected `Immutable.Map`'
      );
    }
  }
};

function mapStateToProps (state) {
  const {dispatch} = state;
  const userDetails = state.get('userDetails');

  return {
    dispatch,
    userDetails
  };
}

export default connect(mapStateToProps)(UserSideBarContainer);

import {Map} from 'immutable';

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import {
  toggleShowUserUpdateView, userDetailsFieldUpdate, updateUserDetails
} from '../../actions/UserDetailsActions';
import UserSideBar from '../../components/UserSidebar/UserSideBar';
import UserSideBarUpdate from '../../components/UserSidebar/UserSideBarUpdate';

class UserSideBarContainer extends React.Component {
  constructor (props) {
    super(props);

    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onToggleShowUpdateView = this.onToggleShowUpdateView.bind(this);
  }

  onFieldUpdate (event) {
    event.preventDefault();
    let updatedUser = this.props.userDetails.get('updatedUser');
    updatedUser = updatedUser.set(event.target.name, event.target.value);
    this.props.dispatch(userDetailsFieldUpdate(updatedUser.toJS()));
  }

  onSubmit () {
    this.props.dispatch(
      updateUserDetails(this.props.userDetails.get('updatedUser').toJS()));
  }

  onToggleShowUpdateView () {
    this.props.dispatch(toggleShowUserUpdateView());
  }

  render () {
    return (
      this.props.userDetails.get('isShowingUpdate')
        ? <UserSideBarUpdate
            handleFieldUpdate={this.onFieldUpdate}
            handleProfileUpdate={this.onSubmit}
            handleToggleShowUpdate={this.onToggleShowUpdateView}
            userDetails={this.props.userDetails.toJS()}
          />
        : <UserSideBar
            handleToggleShowUpdate={this.onToggleShowUpdateView}
            userDetails={this.props.userDetails.toJS()}
          />
    );
  }
};

UserSideBarContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
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

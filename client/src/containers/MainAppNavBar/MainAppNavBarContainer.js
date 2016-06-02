import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Map} from 'immutable';

import MainAppNavBar from '../../components/MainAppNavBar/MainAppNavBar';

import {logoutUser} from '../../actions/AuthActions';
import {loadUserDetails} from '../../actions/UserDetailsActions';
import {changeDocumentsFilter} from '../../actions/DocumentsActions';

class MainAppNavBarContainer extends React.Component {
  constructor (props) {
    super(props);

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.updateUserDetailsIfNeeded = this.updateUserDetailsIfNeeded.bind(this);
  }

  componentDidMount () {
    this.updateUserDetailsIfNeeded(this.props);
  }

  componentWillReceiveProps (nextProps) {
    this.updateUserDetailsIfNeeded(nextProps);
  }

  updateUserDetailsIfNeeded (props) {
    // Fetch user details if we're authenticated and have no user details.
    // This happens when the user is coming back to the application and is
    // using a cached token.
    if (props.auth.get('isAuthenticated') && (!props.userDetails.get('user') &&
        !props.userDetails.get('isFetching'))) {
      this.props.dispatch(loadUserDetails());
    }
  }

  handleLogout (event) {
    this.props.dispatch(logoutUser());
  }

  handleFilterChange (event, value) {
    this.props.dispatch(changeDocumentsFilter(value));
  }

  render () {
    return (
      <MainAppNavBar
        onFilterChange={this.handleFilterChange}
        onLogout={this.handleLogout}
        userDetails={this.props.userDetails.toJS()}
        visibleFilter={this.props.visibleFilter}
      />
    );
  }
}

MainAppNavBarContainer.propTypes = {
  auth: function (props, propName, componentName) {
    if (!props[propName] instanceof Map) {
      return new Error(
        `Invalid prop ${propName} supplied to ${componentName}.` +
        'Expected `Immutable.Map`'
      );
    }
  },
  dispatch: PropTypes.func.isRequired,
  userDetails: function (props, propName, componentName) {
    if (!props[propName] instanceof Map) {
      return new Error(
        `Invalid prop ${propName} supplied to ${componentName}.` +
        'Expected `Immutable.Map`'
      );
    }
  },
  visibleFilter: PropTypes.string.isRequired
};

function mapStateToProps (state) {
  const {dispatch} = state;
  const auth = state.get('auth');
  const userDetails = state.get('userDetails');
  const visibleFilter = state
    .getIn(['docs', 'documentViewOptions', 'visibleFilter']);
  return {
    dispatch,
    auth,
    userDetails,
    visibleFilter
  };
};

export default connect(mapStateToProps)(MainAppNavBarContainer);

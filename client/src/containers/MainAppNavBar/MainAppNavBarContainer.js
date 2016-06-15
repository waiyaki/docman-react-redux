import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import MainAppNavBar from '../../components/MainAppNavBar/MainAppNavBar';
import NavigationDrawer from '../../components/MainAppNavBar/NavigationDrawer';

import { logoutUser } from '../../actions/AuthActions';
import { loadUserDetails } from '../../actions/UserDetailsActions';
import { changeDocumentsFilter } from '../../actions/DocumentsActions';

class MainAppNavBarContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDrawerOpen: false
    };

    this.handleToggleDrawer = this.handleToggleDrawer.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.updateUserDetailsIfNeeded = this.updateUserDetailsIfNeeded.bind(this);
  }

  componentDidMount() {
    this.updateUserDetailsIfNeeded(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateUserDetailsIfNeeded(nextProps);
  }

  updateUserDetailsIfNeeded(props) {
    // Fetch user details if we're authenticated and have no user details.
    // This happens when the user is coming back to the application and is
    // using a cached token.
    if (props.auth.get('isAuthenticated') && (!props.userDetails.get('user') &&
        !props.userDetails.get('isFetching'))) {
      this.props.dispatch(loadUserDetails());
    }
  }

  handleLogout() {
    this.props.dispatch(logoutUser());
  }

  handleFilterChange(event, value) {
    this.props.dispatch(changeDocumentsFilter(value));
  }

  handleToggleDrawer() {
    this.setState({
      isDrawerOpen: !this.state.isDrawerOpen
    });
  }

  render() {
    return (
      <span>
        <MainAppNavBar
          onDrawerToggle={this.handleToggleDrawer}
          onFilterChange={this.handleFilterChange}
          onLogout={this.handleLogout}
          userDetails={this.props.userDetails.toJS()}
          visibleFilter={this.props.visibleFilter}
        />
        <NavigationDrawer
          isDrawerOpen={this.state.isDrawerOpen}
          onDrawerToggle={this.handleToggleDrawer}
          user={this.props.userDetails.get('user')
            ? this.props.userDetails.get('user').toJS()
            : null
          }
        />
      </span>
    );
  }
}

MainAppNavBarContainer.propTypes = {
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
  userDetails: (props, propName, componentName) => {
    if (!props[propName] instanceof Map) {
      return new Error(
        `Invalid prop ${propName} supplied to ${componentName}.` +
        'Expected `Immutable.Map`'
      );
    }
    return undefined;
  },
  visibleFilter: PropTypes.string.isRequired
};

function mapStateToProps(state) {
  const { dispatch } = state;
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
}

export default connect(mapStateToProps)(MainAppNavBarContainer);

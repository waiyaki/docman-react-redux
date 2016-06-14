import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import {
  fetchUserDocuments, fetchAnotherUsersProfile
} from '../../actions/UserDetailsActions';
import ProfilePage from '../../components/ProfilePage/ProfilePage.jsx';

class ProfilePageContainer extends React.Component {
  constructor(props) {
    super(props);

    this.dispatchFetchData = this.dispatchFetchData.bind(this);
    this.getUsernameOrId = this.getUsernameOrId.bind(this);
  }

  componentDidMount() {
    this.dispatchFetchData(this.getUsernameOrId(this.props));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.username !== this.props.params.username) {
      this.dispatchFetchData(this.getUsernameOrId(nextProps));
    }
  }

  getUsernameOrId(props) {
    return props.location.state
      ? props.location.state._id
      : props.params.username.slice(1);
  }

  dispatchFetchData(usernameOrId) {
    this.props.dispatch(fetchAnotherUsersProfile(usernameOrId));

    this.props.dispatch(fetchUserDocuments(usernameOrId));
  }

  render() {
    return (
      <ProfilePage selectedUser={this.props.selectedUser.toJS()} />
    );
  }
}

ProfilePageContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      _id: PropTypes.string,
      username: PropTypes.string
    })
  }).isRequired,
  params: PropTypes.shape({
    username: PropTypes.string.isRequired
  }),
  selectedUser: (props, propName, componentName) => {
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
  const selectedUser = state.get('selectedUser');
  return {
    dispatch,
    selectedUser
  };
}

export default connect(mapStateToProps)(ProfilePageContainer);

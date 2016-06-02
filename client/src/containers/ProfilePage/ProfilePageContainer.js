import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Map} from 'immutable';

import {
  fetchUserDocuments, fetchAnotherUsersProfile
} from '../../actions/UserDetailsActions';
import ProfilePage from '../../components/ProfilePage/ProfilePage.jsx';

class ProfilePageContainer extends React.Component {
  constructor (props) {
    super(props);

    this.dispatchFetchData = this.dispatchFetchData.bind(this);
  }

  componentDidMount () {
    this.dispatchFetchData(this.props.params.username.slice(1));
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.params.username !== this.props.params.username) {
      this.dispatchFetchData(nextProps.params.username.slice(1));
    }
  }

  dispatchFetchData (username) {
    this.props.dispatch(fetchAnotherUsersProfile(username));

    this.props.dispatch(fetchUserDocuments(username));
  }
  render () {
    return (
      <ProfilePage
        selectedUser={this.props.selectedUser.toJS()}
      />
    );
  }
}

ProfilePageContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.shape({
    username: PropTypes.string.isRequired
  }),
  selectedUser: function (props, propName, componentName) {
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
  const selectedUser = state.get('selectedUser');
  return {
    dispatch,
    selectedUser
  };
};

export default connect(mapStateToProps)(ProfilePageContainer);

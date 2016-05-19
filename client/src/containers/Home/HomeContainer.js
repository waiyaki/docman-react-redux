import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

/* eslint-disable no-unused-vars */
import Home from '../../components/Home/Home.jsx';
import UnauthenticatedHomeContainer from '../Auth/UnauthenticatedHomeContainer';
/* eslint-enable no-unused-vars */

class HomeContainer extends React.Component {
  render () {
    return this.props.auth.get('isAuthenticated')
      ? <Home />
      : <UnauthenticatedHomeContainer />;
  }
}

HomeContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

function mapStateToProps (state) {
  const {dispatch} = state;
  const auth = state.get('auth');
  return {
    dispatch,
    auth
  };
};

export default connect(mapStateToProps)(HomeContainer);

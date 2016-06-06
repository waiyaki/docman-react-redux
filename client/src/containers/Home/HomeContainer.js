import React from 'react';
import {connect} from 'react-redux';
import {Map} from 'immutable';

import Home from '../../components/Home/Home.jsx';

class HomeContainer extends React.Component {
  render () {
    return (
      <Home userDetails={this.props.userDetails.toJS()}/>
    );
  }
}

HomeContainer.propTypes = {
  auth: function (props, propName, componentName) {
    if (!props[propName] instanceof Map) {
      return new Error(
        `Invalid prop ${propName} supplied to ${componentName}.` +
        'Expected `Immutable.Map`'
      );
    }
  },
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
  const auth = state.get('auth');
  const userDetails = state.get('userDetails');

  return {
    auth,
    userDetails
  };
};

export default connect(mapStateToProps)(HomeContainer);

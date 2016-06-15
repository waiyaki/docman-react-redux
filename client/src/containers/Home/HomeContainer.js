import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import Home from '../../components/Home/Home.jsx';

const HomeContainer = (props) => (
  <Home userDetails={props.userDetails.toJS()} />
);

HomeContainer.propTypes = {
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
  const userDetails = state.get('userDetails');

  return {
    userDetails
  };
}

export default connect(mapStateToProps)(HomeContainer);

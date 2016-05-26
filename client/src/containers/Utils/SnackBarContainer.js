import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import Snackbar from 'material-ui/Snackbar';
import {clearToastMessage} from '../../actions/UtilityActions';

const snackBarStyle = {
  bottom: '2%'
};

class SnackBarContainer extends React.Component {
  constructor (props) {
    super(props);

    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  /**
   * Clear the snackbar message in the state when we hide the snackbar.
   */
  handleRequestClose () {
    this.props.dispatch(clearToastMessage());
  }

  render () {
    return (
      <Snackbar
        autoHideDuration={3000}
        message={this.props.utils.snackBarMessage || 'Placeholder message'}
        onRequestClose={this.handleRequestClose}
        open={this.props.utils.isShowingSnackBar}
        style={snackBarStyle}
      />
    );
  }
}

function mapStateToProps (state) {
  const {dispatch} = state;
  const utils = state.get('utils').toJS();

  return {
    dispatch,
    utils
  };
}

SnackBarContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  utils: PropTypes.shape({
    isShowingSnackBar: PropTypes.bool.isRequired,
    snackBarMessage: PropTypes.string
  }).isRequired
};

export default connect(mapStateToProps)(SnackBarContainer);

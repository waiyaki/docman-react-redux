import React from 'react';
import {connect} from 'react-redux';

import {
  loginUser, signupUser, credentialsUpdate, toggleLoginView
} from '../../actions/AuthActions';
import {validateField} from '../../actions/AuthValidationActions';

/* eslint-disable no-unused-vars */
import UnauthenticatedHomePage from '../../components/Auth/UnauthenticatedHomePage';
/* eslint-disable no-unused-vars */

class UnauthenticatedHomeContainer extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      errors: null
    };

    this.handleAuthAction = this.handleAuthAction.bind(this);
    this.handleFieldUpdate = this.handleFieldUpdate.bind(this);
    this.handleValidateField = this.handleValidateField.bind(this);
    this.toggleView = this.toggleView.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    let errors = nextProps.auth.get('error');
    errors = errors ? errors.toJS() : null;
    if (errors) {
      let messages = [];
      if (Array.isArray(errors)) {
        messages = errors.map(error => {
          return Object.keys(error).map(key => `${key}: ${error[key]}`);
        }).toString().split(',');
      } else {
        messages.push(errors.message);
      }
      this.setState({
        errors: messages
      });
    } else {
      this.setState({
        errors: null
      });
    }
  }

  handleAuthAction () {
    if (this.props.auth.get('isShowingLogin')) {
      this.props.dispatch(loginUser(
        this.props.auth.get('credentials').toJS()));
    } else {
      this.props.dispatch(signupUser(
        this.props.auth.get('credentials').toJS()));
    }
  }

  handleFieldUpdate (event) {
    event.preventDefault();
    let credentials = this.props.auth.get('credentials');
    credentials = credentials.set(event.target.name, event.target.value);
    this.props.dispatch(credentialsUpdate(credentials.toJS()));
    this.props.dispatch(validateField(event.target.name));
  }

  handleValidateField (event) {
    event.preventDefault();
    let validations = this.props.auth.get('validations').toJS();
    if (!validations.isValid) {
      this.props.dispatch(validateField(event.target.name));
    }
  }

  toggleView () {
    this.props.dispatch(toggleLoginView());
  }

  render () {
    return <UnauthenticatedHomePage
      auth={this.props.auth.toJS()}
      errors={this.state.errors}
      onAuthAction={this.handleAuthAction}
      onFieldUpdate={this.handleFieldUpdate}
      toggleView={this.toggleView}
      onValidateField={this.handleValidateField}
      />;
  }
}

function mapStateToProps (state) {
  const {dispatch} = state;
  const auth = state.get('auth');
  return {
    dispatch,
    auth
  };
}

export default connect(mapStateToProps)(UnauthenticatedHomeContainer);

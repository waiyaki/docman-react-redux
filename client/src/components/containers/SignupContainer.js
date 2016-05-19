import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import {signupUser} from '../../actions/SignupActions';
import SignupPage from '../presentational/SignupPage'; // eslint-disable-line

class SignupContainer extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      error: null
    };

    this.handleSignup = this.handleSignup.bind(this);
    this.handleFieldUpdate = this.handleFieldUpdate.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    let auth = nextProps.auth.toJS();
    if (auth.error) {
      let messages = [];
      if (Array.isArray(auth.error)) {
        messages = auth.error.map(error => {
          return Object.keys(error).map(key => `${key}: ${error[key]}`);
        }).toString().split(',');
      } else {
        messages.push(auth.error.message);
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

  handleSignup () {
    this.props.dispatch(signupUser({
      username: this.state.username,
      password: this.state.password,
      email: this.state.email
    }));
  }

  handleFieldUpdate (event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render () {
    return <SignupPage
      onSignup={this.handleSignup}
      onFieldUpdate={this.handleFieldUpdate}
      auth={this.props.auth.toJS()}
      errors={this.state.errors}
    />;
  }
}

SignupContainer.propTypes = {
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps (state) {
  const {dispatch} = state;
  const auth = state.get('auth');
  return {
    dispatch,
    auth
  };
}

export default connect(mapStateToProps)(SignupContainer);

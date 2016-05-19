import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import {loginUser} from '../../actions/LoginActions';
import Login from '../presentational/Login'; // eslint-disable-line

class LoginContainer extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      error: null
    };

    this.handleLogin = this.handleLogin.bind(this);
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
    }
  }

  handleLogin () {
    this.props.dispatch(loginUser({
      username: this.state.username,
      password: this.state.password
    }));
  }

  handleFieldUpdate (event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render () {
    return <Login
      onLogin={this.handleLogin}
      onFieldUpdate={this.handleFieldUpdate}
      auth={this.props.auth.toJS()}
      errors={this.state.errors}
    />;
  }
}

LoginContainer.propTypes = {
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

export default connect(mapStateToProps)(LoginContainer);

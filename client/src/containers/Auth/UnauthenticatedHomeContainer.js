import React from 'react';
import {connect} from 'react-redux';

import {loginUser} from '../../actions/LoginActions';
import {signupUser} from '../../actions/SignupActions';

/* eslint-disable no-unused-vars */
import UnauthenticatedHomePage from '../../components/Auth/UnauthenticatedHomePage';
/* eslint-disable no-unused-vars */

class UnauthenticatedHomeContainer extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      showingLogin: true
    };

    this.handleAuthAction = this.handleAuthAction.bind(this);
    this.handleFieldUpdate = this.handleFieldUpdate.bind(this);
    this.toggleView = this.toggleView.bind(this);
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

  handleAuthAction () {
    if (this.state.showingLogin) {
      this.props.dispatch(loginUser({
        username: this.state.username,
        password: this.state.password
      }));
    } else {
      this.props.dispatch(signupUser({
        username: this.state.username,
        password: this.state.password,
        email: this.state.email
      }));
    }
  }

  handleFieldUpdate (event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  toggleView () {
    this.setState({
      showingLogin: !this.state.showingLogin,
      errors: null
    });
  }

  render () {
    return <UnauthenticatedHomePage
      auth={this.props.auth.toJS()}
      errors={this.state.errors}
      onAuthAction={this.handleAuthAction}
      onFieldUpdate={this.handleFieldUpdate}
      showingLogin={this.state.showingLogin}
      toggleView={this.toggleView}
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

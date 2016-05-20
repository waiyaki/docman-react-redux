import {Map} from 'immutable';
import Validator from 'validator';

export default function (state = Map(), action) {
  let newState = state;
  switch (action.type) {
    case 'username':
      let username = state.getIn(['credentials', 'username']);
      if (!username) {
        newState = state.mergeDeep(Map({
          validations: Map({
            username: 'This field is required.'
          })
        }));
      } else if (!Validator.isLength(username, {min: 3, max: 20})) {
        newState = state.mergeDeep(Map({
          validations: Map({
            username: 'Username should be between 3 and 20 characters.'
          })
        }));
      } else if (state.getIn(['validations', 'username'])) {
        newState = state.mergeDeep(Map({
          validations: Map({
            username: null
          })
        }));
      }
      break;

    case 'email':
      let email = state.getIn(['credentials', 'email']);
      if (!email) {
        newState = state.mergeDeep(Map({
          validations: Map({
            email: 'This field is required.'
          })
        }));
      } else if (!Validator.isEmail(email)) {
        newState = state.mergeDeep(Map({
          validations: Map({
            email: 'Please provide a valid email address.'
          })
        }));
      } else if (state.getIn(['validations', 'email'])) {
        newState = state.mergeDeep(Map({
          validations: Map({
            email: null
          })
        }));
      }
      break;

    case 'password':
      let password = state.getIn(['credentials', 'password']);
      if (!password) {
        newState = state.mergeDeep(Map({
          validations: Map({
            password: 'This field is required.'
          })
        }));
      } else if (!Validator.isLength(password, {min: 6})) {
        newState = state.mergeDeep(Map({
          validations: Map({
            password: 'Password should be 6 or more characters long.'
          })
        }));
      } else if (state.getIn(['validations', 'password'])) {
        newState = state.mergeDeep(Map({
          validations: Map({
            password: null
          })
        }));
      }
      break;

    case 'confirmPassword':
      let confirmPassword = state.getIn(['credentials', 'confirmPassword']);
      if (!confirmPassword) {
        newState = state.mergeDeep(Map({
          validations: Map({
            confirmPassword: 'This field is required.'
          })
        }));
      } else if (confirmPassword !== state.getIn(['credentials', 'password'])) {
        newState = state.mergeDeep(Map({
          validations: Map({
            confirmPassword: 'The passwords do not match.'
          })
        }));
      } else if (state.getIn(['validations', 'confirmPassword'])) {
        newState = state.mergeDeep(Map({
          validations: Map({
            confirmPassword: null
          })
        }));
      }
      break;
  }

  // Determine whether there are any errors or this form is valid.
  let isValid = newState.getIn(['credentials', 'username']) &&
    newState.getIn(['credentials', 'password']) &&
    !newState.getIn(['validations', 'username']) &&
    !newState.getIn(['validations', 'password']);

  // In case we are signing up...
  if (!newState.get('isShowingLogin')) {
    isValid = isValid &&
      newState.getIn(['credentials', 'confirmPassword']) &&
      !newState.getIn(['validations', 'confirmPassword']);
  }

  newState = newState.mergeDeep(Map({
    validations: Map({
      isValid: isValid
    })
  }));

  return newState;
};

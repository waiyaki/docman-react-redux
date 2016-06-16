import { Map } from 'immutable';
import Validator from 'validator';

/**
 * Performs validations for various fields.
 *
 * Generally, it checks whether the given field meets some criteria.
 * If it doesn't, an appropriate message is set in the validations state using
 * that field as the key for that message.
 * If it does, it checks the validations to see whether there was an error
 * specific to this field. If there was, it clears that error which signifies
 * that the field is clean.
 */

// TODO: Refactor this whole function into composable functions. :cold_sweat:

export default function (state = Map(), action) {
  let newState = state;

  // We need to modify where we get field values from in the state based on
  // the view we're currently validating.
  // We'll use the action.target for this.
  switch (action.type) {
    case 'username': {
      const username = state.getIn([action.target, 'username']);
      if (!username) {
        newState = state.mergeDeep(Map({
          validations: Map({
            username: 'This field is required.'
          })
        }));
      } else if (!Validator.isLength(username, { min: 3, max: 20 })) {
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
    }

    case 'email': {
      const email = state.getIn([action.target, 'email']);
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
    }

    /**
     * Validate password input.
     *
     * The password is required for authentication functionality but it's
     * not required when updating a user's details.
     */
    case 'password': {
      const password = state.getIn([action.target, 'password']);
      const password2 = state.getIn([action.target, 'confirmPassword']);
      if (!password && action.currentView === 'auth') {
        newState = state.mergeDeep(Map({
          validations: Map({
            password: 'This field is required.'
          })
        }));
      } else if (password && !Validator.isLength(password, { min: 6 })) {
        newState = state.mergeDeep(Map({
          validations: Map({
            password: 'Password should be 6 or more characters long.'
          })
        }));
      } else if (password && password.length >= 6 &&
          !password2 && action.currentView === 'userDetails') {
        newState = state.mergeDeep(Map({
          validations: Map({
            confirmPassword: 'Please confirm your password',
            password: null
          })
        }));
      } else if (!password && state.getIn(['validations', 'confirmPassword'])) {
        /**
         * If the user just deleted their new password, remove any validations
         * that may have been there for the confirmPassword field.
         */
        newState = state.mergeDeep(Map({
          validations: Map({
            confirmPassword: null
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
    }

    /**
     * Validate password confirmation input.
     *
     * This field is not required when updating a user's details, unless the
     * user has a value in the password field, which would imply that they're
     * updating the password as well. Password update necessitates the
     * validation of the confirmPassword field.
     */
    case 'confirmPassword': {
      const confirmPassword = state.getIn([action.target, 'confirmPassword']);
      if (!confirmPassword && action.currentView === 'auth') {
        newState = state.mergeDeep(Map({
          validations: Map({
            confirmPassword: 'This field is required.'
          })
        }));
      } else if (!confirmPassword && action.currentView === 'userDetails' &&
          state.getIn([action.target, 'password'])) {
        newState = state.mergeDeep(Map({
          validations: Map({
            confirmPassword: 'This field is required.'
          })
        }));
      } else if (confirmPassword !== state.getIn([action.target, 'password'])) {
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

    case 'title': {
      const title = state.getIn([action.target, 'title']);
      if (!title) {
        newState = state.mergeDeep(Map({
          validations: Map({
            title: 'This field is required'
          })
        }));
      } else if (title.length > 144) {
        newState = state.mergeDeep(Map({
          validations: Map({
            title: 'This field should not be more than 144 characters.'
          })
        }));
      } else if (state.getIn(['validations', 'title'])) {
        newState = state.mergeDeep(Map({
          validations: Map({
            title: null
          })
        }));
      }
      break;
    }

    case 'content': {
      const content = state.getIn([action.target, 'content']);
      if (!content) {
        newState = state.mergeDeep(Map({
          validations: Map({
            content: 'This field is required'
          })
        }));
      } else if (content.length < 10) {
        newState = state.mergeDeep(Map({
          validations: Map({
            content: 'This field field should be at least 10 characters.'
          })
        }));
      } else if (state.getIn(['validations', 'content'])) {
        newState = state.mergeDeep(Map({
          validations: Map({
            content: null
          })
        }));
      }
      break;
    }

    default:
      break;
  }

  /**
  * Determine whether there are any errors or this form is valid.
  * The form validity will be computed differently according to the current view
  * specified in the action.
  */
  let isValid = false; // Guilty until proven innocent. ¯\_(ツ)_/¯

  if (action.currentView === 'auth') {
    // Validation state based on fields specific to authentication.
    isValid = newState.getIn([action.target, 'username']) &&
      newState.getIn([action.target, 'password']) &&
      !newState.getIn(['validations', 'username']) &&
      !newState.getIn(['validations', 'password']);

    // In case we are signing up, make sure we validate that we have the
    // email and password confirmation and that both are valid.
    if (!newState.get('isShowingLogin')) {
      isValid = isValid &&
        newState.getIn([action.target, 'email']) &&
        !newState.getIn(['validations', 'email']) &&
        newState.getIn([action.target, 'confirmPassword']) &&
        !newState.getIn(['validations', 'confirmPassword']);
    }
  } else if (action.currentView === 'userDetails') {
    // Validation state based on fields specific to user profile update.

    // Ensure there are no validation errors for either the username or email
    isValid = !newState.getIn(['validations', 'email']) &&
      !newState.getIn(['validations', 'username']);

    // If the user is changing their password, make sure we validate that we
    // have a corresponding password confirmation and that it is valid.
    if (newState.getIn([action.target, 'password'])) {
      isValid = isValid && !newState.getIn(['validations', 'password']) &&
        newState.getIn([action.target, 'confirmPassword']) &&
        !newState.getIn(['validations', 'confirmPassword']);
    }

    // Valid only if there are values in the input fields.
    isValid = isValid && (newState.getIn([action.target, 'email']) ||
      newState.getIn([action.target, 'username']) ||
      newState.getIn([action.target, 'password']) ||
      newState.getIn([action.target, 'firstName']) ||
      newState.getIn([action.target, 'lastName']));
  } else if (action.currentView === 'documentContent') {
    isValid = newState.getIn([action.target], 'title') &&
      !newState.getIn(['validations', 'title']) &&
      newState.getIn([action.target, 'content']) &&
      !newState.getIn(['validations', 'content']);
  }

  newState = newState.mergeDeep(Map({
    validations: Map({
      isValid: !!isValid
    })
  }));

  return newState;
}

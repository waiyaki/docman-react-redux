import { CLEAR_SNACKBAR_MESSAGE, SHOW_SNACKBAR_MESSAGE } from '../constants';

export function clearToastMessage() {
  return {
    type: CLEAR_SNACKBAR_MESSAGE
  };
}

export function showSnackBarMessage(message) {
  return {
    type: SHOW_SNACKBAR_MESSAGE,
    message
  };
}

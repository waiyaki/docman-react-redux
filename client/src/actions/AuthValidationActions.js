import {VALIDATE_FIELD} from '../constants';

export function validateField (field) {
  return {
    type: VALIDATE_FIELD,
    field
  };
}

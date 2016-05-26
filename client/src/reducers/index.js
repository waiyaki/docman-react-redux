import {combineReducers} from 'redux-immutable';

import AuthReducer from './AuthReducer';
import UserDetailsReducer from './UserDetailsReducer';
import UtilsReducer from './UtilsReducer';

const RootReducer = combineReducers({
  auth: AuthReducer,
  userDetails: UserDetailsReducer,
  utils: UtilsReducer
});

export default RootReducer;

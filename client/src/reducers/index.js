import {combineReducers} from 'redux-immutable';

import AuthReducer from './AuthReducer';
import UserDetailsReducer from './UserDetailsReducer';

const RootReducer = combineReducers({
  auth: AuthReducer,
  userDetails: UserDetailsReducer
});

export default RootReducer;

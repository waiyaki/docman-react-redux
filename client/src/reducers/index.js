import {combineReducers} from 'redux-immutable';

import AuthReducer from './AuthReducer';
import UserDetailsReducer from './UserDetailsReducer';
import UtilsReducer from './UtilsReducer';
import DocumentsReducer from './DocumentsReducer';
import RolesReducer from './RolesReducer';

const RootReducer = combineReducers({
  auth: AuthReducer,
  docs: DocumentsReducer,
  roles: RolesReducer,
  userDetails: UserDetailsReducer,
  utils: UtilsReducer
});

export default RootReducer;

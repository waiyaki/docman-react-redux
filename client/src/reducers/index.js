import {combineReducers} from 'redux-immutable';

import AuthReducer from './AuthReducer';
import UserDetailsReducer from './UserDetailsReducer';
import UtilsReducer from './UtilsReducer';
import DocumentsReducer from './DocumentsReducer';
import RolesReducer from './RolesReducer';
import SelectedUserReducer from './SelectedUserReducer';

const RootReducer = combineReducers({
  auth: AuthReducer,
  docs: DocumentsReducer,
  roles: RolesReducer,
  selectedUser: SelectedUserReducer,
  userDetails: UserDetailsReducer,
  utils: UtilsReducer
});

export default RootReducer;

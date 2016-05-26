import {combineReducers} from 'redux-immutable';

import AuthReducer from './AuthReducer';
import UserDetailsReducer from './UserDetailsReducer';
import UtilsReducer from './UtilsReducer';
import DocumentsReducer from './DocumentsReducer';

const RootReducer = combineReducers({
  auth: AuthReducer,
  docs: DocumentsReducer,
  userDetails: UserDetailsReducer,
  utils: UtilsReducer
});

export default RootReducer;

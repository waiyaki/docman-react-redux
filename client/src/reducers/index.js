import {combineReducers} from 'redux-immutable';

import AuthReducer from './AuthReducer';

const RootReducer = combineReducers({
  auth: AuthReducer
});

export default RootReducer;

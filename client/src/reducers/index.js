import combineReducers from 'redux';

import AuthReducer from './AuthReducer';

const RootReducer = combineReducers(
  AuthReducer
);

export default RootReducer;

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import RootReducer from '../reducers';

export default function configureStore(initialState) {
  return createStore(
    RootReducer,
    initialState,
    applyMiddleware(
      thunkMiddleware // Enable us to dispatch functions
    )
  );
}

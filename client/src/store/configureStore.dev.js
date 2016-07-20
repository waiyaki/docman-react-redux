
import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';

const loggerMiddleware = createLogger({
  collapsed: true,
  stateTransformer: (state) => state.toJS()
});

const enhancer = compose(
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  ),
  DevTools.instrument()
);

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      /* eslint-disable global-require */
      const nextReducer = require('../reducers/index');
      /* eslint-enable global-require */
      store.replaceReducer(nextReducer);
    });
  }
  return store;
}

import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import injectTapEventPlugin from 'react-tap-event-plugin';

try {
  injectTapEventPlugin();
} catch (err) {
  // Ignore error if tap event plugin was already injected.
}

import Routes from './src/routes';
import configureStore from './src/store/configureStore';

const store = configureStore();

render(
  <AppContainer>
    <Routes store={store} />
  </AppContainer>,
  document.getElementById('app')
);

if (process.env.NODE_ENV !== 'production') {
  module.hot.accept();
}

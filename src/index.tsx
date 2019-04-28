import React from 'react';
import { render } from 'react-dom';

const root = document.getElementById('app');

function renderApp() {
  const App = require('./App').default;
  render(<App />, root);
}

renderApp();

interface HotNodeModule extends NodeModule {
  hot: any;
}

declare var module: HotNodeModule;

if (module.hot) {
  module.hot.accept(renderApp);
}

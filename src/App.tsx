import './App.scss';
import React from 'react';
import { hot } from 'react-hot-loader';

import Timelines from './component/Timelines';

class App extends React.Component {
  render() {
    return <Timelines />;
  }
}

export default hot(module)(App);

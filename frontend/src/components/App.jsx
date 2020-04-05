import React from 'react';
import {Grid} from 'semantic-ui-react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';

import Login from './Login';

const App = () => {
  return (
    <Router>
      <Route path="/" component={Login} />
    </Router>
  );
};

export default App;

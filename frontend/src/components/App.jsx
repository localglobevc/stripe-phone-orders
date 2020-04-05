import React, {useEffect} from 'react';
import {Grid} from 'semantic-ui-react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';

import stripeKey from '../utils/stripeKey';
import {setupAuth} from '../utils/auth';
import Order from './Order';
import Login from './Login';

setupAuth();

const stripePromise = loadStripe(stripeKey);

const App = () => {
  return (
    <Elements stripe={stripePromise}>
      <Router>
        <Switch>
          <Route path="/order" component={Order} />
          <Route path="/" component={Login} />
        </Switch>
      </Router>
    </Elements>
  );
};

export default App;

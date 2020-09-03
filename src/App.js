import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Home'
import Component from './Component/Component'
import Exercise from './Exercise/Exercise'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/component" component={Component} />
        <Route exact path="/exercise" component={Exercise} />
      </Switch>
    </Router>
  );
}

export default App;

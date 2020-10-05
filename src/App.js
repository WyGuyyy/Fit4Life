import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Home'
import Component from './Component/Component'
import Exercise from './Exercise/Exercise'
import Goal from './Goal/Goal'
import Authenticate from './Authenticate/Authenticate'
import GoalDetail from './Goal/GoalDetail';
import GoalEdit from './Goal/GoalEdit';
import GoalCreate from './Goal/GoalCreate';
import PersonalInfoEdit from './PersonalInfo/PersonalInfoEdit';
import PersonalInfo from './PersonalInfo/PersonalInfo';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/component" component={Component} />
        <Route exact path="/exercise" component={Exercise} />
        <Route exact path="/goal" component={Goal} />
        <Route exact path="/goalDetail" component={GoalDetail} />
        <Route exact path="/goalEdit" component={GoalEdit} />
        <Route exact path="/goalCreate" component={GoalCreate} />
        <Route exact path="/schedule" component={Goal} />
        <Route exact path="/personal" component={PersonalInfo} />
        <Route exact path="/personalEdit" component={PersonalInfoEdit} />
        <Route exact path="/invite" component={Goal} />
        <Route exact path="/authenticate" component={Authenticate} />
      </Switch>
    </Router>
  );
}

export default App;

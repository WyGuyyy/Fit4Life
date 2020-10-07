import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Home'
import Classroom from './Classroom/Classroom';
import Component from './Component/Component'
import Exercise from './Exercise/Exercise'
import Goal from './Goal/Goal'
import Authenticate from './Authenticate/Authenticate'
import GoalDetail from './Goal/GoalDetail';
import GoalEdit from './Goal/GoalEdit';
import GoalCreate from './Goal/GoalCreate';
import PersonalInfoEdit from './PersonalInfo/PersonalInfoEdit';
import PersonalInfo from './PersonalInfo/PersonalInfo';
import Invite from './Invite/Invite';
import Schedule from './Schedule/Schedule';
import AdminHome from './Admin/AdminHome/AdminHome';
import ClassroomCreateAdmin from './Admin/AdminHome/ClassroomCreateAdmin';
import ClassroomEditAdmin from './Admin/AdminHome/ClassroomEditAdmin';
import AdminClassroom from './Admin/AdminClassroom/AdminClassroom';
import ComponentCreateAdmin from './Admin/AdminClassroom/ComponentCreateAdmin';
import ComponentEditAdmin from './Admin/AdminClassroom/ComponentEditAdmin';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/classroom" component={Classroom} />
        <Route exact path="/component" component={Component} />
        <Route exact path="/exercise" component={Exercise} />
        <Route exact path="/goal" component={Goal} />
        <Route exact path="/goalDetail" component={GoalDetail} />
        <Route exact path="/goalEdit" component={GoalEdit} />
        <Route exact path="/goalCreate" component={GoalCreate} />
        <Route exact path="/schedule" component={Schedule} />
        <Route exact path="/personal" component={PersonalInfo} />
        <Route exact path="/personalEdit" component={PersonalInfoEdit} />
        <Route exact path="/invite" component={Invite} />
        <Route exact path="/authenticate" component={Authenticate} />
        <Route exact path="/admin" component={AdminHome} />
        <Route exact path="/classroomCreateAdmin" component={ClassroomCreateAdmin} />
        <Route exact path="/classroomEditAdmin" component={ClassroomEditAdmin} />
        <Route exact path="/classroomAdmin" component={AdminClassroom} />
        <Route exact path="/componentCreateComponent" component={ClassroomCreateAdmin} />
        <Route exact path="/componentEditAdmin" component={ClassroomEditAdmin} />
      </Switch>
    </Router>
  );
}

export default App;

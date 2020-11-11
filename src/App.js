import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
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
import AdminComponent from './Admin/AdminComponent/AdminComponent';
import ExerciseCreateAdmin from './Admin/AdminComponent/ExerciseCreateAdmin';
import ExerciseEditAdmin from './Admin/AdminComponent/ExerciseEditAdmin';
import AdminStudent from './Admin/AdminStudent/AdminStudent';
import StudentInviteAdmin from './Admin/AdminStudent/StudentInviteAdmin';
import WorkoutDetail from './Schedule/WorkoutDetail';
import StudentDetailAdmin from './Admin/AdminStudent/AdminStudentDetails';
import CreateAccount from './Authenticate/CreateAccount';
import {authService} from './_services/AuthenticationService';
import { AiFillPropertySafety, AiTwotoneQuestionCircle } from 'react-icons/ai';
import { FaCheck } from 'react-icons/fa';

const PrivateRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={(props) => (
    //(localStorage.getItem('logged_in') === true)
      (check().localeCompare("true") === 0)
      ? <Component {...props} />
      : <Redirect to='/login' login={authService}/>
  )}/>
)

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Authenticate} />
        <Route exact path="/createAccount" component={CreateAccount} />
        <PrivateRoute exact path="/" component={Home} />
        <PrivateRoute exact path="/classroom" component={Classroom} />
        <PrivateRoute exact path="/component" component={Component} />
        <PrivateRoute exact path="/exercise" component={Exercise} />
        <PrivateRoute exact path="/goal" component={Goal} />
        <PrivateRoute exact path="/goalDetail" component={GoalDetail} />
        <PrivateRoute exact path="/goalEdit" component={GoalEdit} />
        <PrivateRoute exact path="/goalCreate" component={GoalCreate} />
        <PrivateRoute exact path="/schedule" component={Schedule} />
        <PrivateRoute exact path="/personal" component={PersonalInfo} />
        <PrivateRoute exact path="/personalEdit" component={PersonalInfoEdit}/>
        <PrivateRoute exact path="/invite" component={Invite} />
        <PrivateRoute exact path="/authenticate" component={Authenticate}/>
        <PrivateRoute exact path="/admin" component={AdminHome} />
        <PrivateRoute exact path="/classroomCreateAdmin" component={ClassroomCreateAdmin} />
        <PrivateRoute exact path="/classroomEditAdmin" component={ClassroomEditAdmin} />
        <PrivateRoute exact path="/classroomAdmin" component={AdminClassroom} />
        <PrivateRoute exact path="/componentCreateAdmin" component={ComponentCreateAdmin} />
        <PrivateRoute exact path="/componentEditAdmin" component={ComponentEditAdmin} />
        <PrivateRoute exact path="/componentAdmin" component={AdminComponent} />
        <PrivateRoute exact path="/exerciseCreateAdmin" component={ExerciseCreateAdmin} />
        <PrivateRoute exact path="/exerciseEditAdmin" component={ExerciseEditAdmin} />
        <PrivateRoute exact path="/studentAdmin" component={AdminStudent} />
        <PrivateRoute exact path="/studentInviteAdmin" component={StudentInviteAdmin} />
        <PrivateRoute exact path="/workoutDetail" component={WorkoutDetail} />
        <PrivateRoute exact path="/studentDetailAdmin" component={StudentDetailAdmin} />
      </Switch>
    </Router>
  );
}

function check(){
  return localStorage.getItem("logged_in");
}

export default App;

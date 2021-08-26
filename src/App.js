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
import ChangePassword from './Password/ChangePassword';
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
import EditWorkout from './Schedule/EditWorkout';
import {authService} from './_services/AuthenticationService';
import { AiFillPropertySafety, AiTwotoneQuestionCircle } from 'react-icons/ai';
import { FaCheck } from 'react-icons/fa';
import {baseURI} from './_services/APIService';
import CategoryManagerAdmin from './Admin/AdminComponent/CategoryManagerAdmin';
import CategoryView from './Component/CategoryView';

const PrivateRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={(props) => (
    //(localStorage.getItem('logged_in') === true)
      (loggedIn().localeCompare("true") === 0)
      ? (localStorage.getItem("userRole").localeCompare("STUDENT") === 0 || 
        (props.location.pathname.localeCompare("/workoutDetail") === 0 || 
         props.location.pathname.localeCompare("/schedule") === 0 || 
         props.location.pathname.localeCompare("/personal") === 0 ||
         props.location.pathname.localeCompare("/personalEdit") === 0 ||
         props.location.pathname.localeCompare("/classroom") === 0 || 
         props.location.pathname.localeCompare("/component") === 0 || 
         props.location.pathname.localeCompare("/changePassword") === 0) ? 
         <Component {...props} /> : <Redirect to="/admin"/>)
      : <Redirect to='/login' login={authService}/>
  )}/>
)

const PrivateAdminRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={(props) => (
    //(localStorage.getItem('logged_in') === true)
      (loggedIn().localeCompare("true") === 0)
      ? (localStorage.getItem("userRole").localeCompare("ADMIN") === 0 ? <Component {...props} /> : <Redirect to="/"/>)
      : <Redirect to='/login' login={authService}/>
  )}/>
)

function App() {

  if(localStorage.getItem('logged_in') === undefined || localStorage.getItem('logged_in') === null){ 
      localStorage.setItem('logged_in', "false");
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Authenticate} />
        <Route exact path="/createAccount" component={CreateAccount} />
        <PrivateRoute exact path="/" component={Home} />
        <PrivateRoute exact path="/classroom" component={Component} />
        <PrivateRoute exact path="/exercise" component={Exercise} />
        <PrivateRoute exact path="/goal" component={Goal} />
        <PrivateRoute exact path="/goalDetail" component={GoalDetail} />
        <PrivateRoute exact path="/goalEdit" component={GoalEdit} />
        <PrivateRoute exact path="/goalCreate" component={GoalCreate} />
        <PrivateRoute exact path="/schedule" component={Schedule} />
        <PrivateRoute exact path="/changePassword" component={ChangePassword} />
        <PrivateRoute exact path="/workoutDetail" component={WorkoutDetail} />
        <PrivateRoute exact path="/workoutEdit" component={EditWorkout} />
        <PrivateRoute exact path="/personal" component={PersonalInfo} />
        <PrivateRoute exact path="/personalEdit" component={PersonalInfoEdit}/>
        <PrivateRoute exact path="/invite" component={Invite} />
        <PrivateRoute exact path="/authenticate" component={Authenticate}/>
        <PrivateRoute exact path="/categoryView" component={CategoryView}/>
        <PrivateAdminRoute exact path="/admin" component={AdminHome} />
        <PrivateAdminRoute exact path="/classroomCreateAdmin" component={ClassroomCreateAdmin} />
        <PrivateAdminRoute exact path="/classroomEditAdmin" component={ClassroomEditAdmin} />
        <PrivateAdminRoute exact path="/classroomAdmin" component={AdminComponent} />
        <PrivateAdminRoute exact path="/exerciseCreateAdmin" component={ExerciseCreateAdmin} />
        <PrivateAdminRoute exact path="/exerciseEditAdmin" component={ExerciseEditAdmin} />
        <PrivateAdminRoute exact path="/studentAdmin" component={AdminStudent} />
        <PrivateAdminRoute exact path="/studentInviteAdmin" component={StudentInviteAdmin} />
        <PrivateAdminRoute exact path="/studentDetailAdmin" component={StudentDetailAdmin} />
        <PrivateAdminRoute exact path="/categoryManagerAdmin" component={CategoryManagerAdmin} />
      </Switch>
    </Router>
  );
}

function loggedIn(){

  if(localStorage.getItem("logged_in") === null || localStorage.getItem("logged_in") === undefined){
    return "false";
  }

  return localStorage.getItem("logged_in");
}

export default App;

//<PrivateRoute exact path="/classroom" component={Classroom} />
/*
<PrivateAdminRoute exact path="/componentCreateAdmin" component={ComponentCreateAdmin} />
<PrivateAdminRoute exact path="/componentEditAdmin" component={ComponentEditAdmin} />
<PrivateAdminRoute exact path="/classroomAdmin" component={AdminClassroom} />
*/

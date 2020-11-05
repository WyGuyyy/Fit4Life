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
import {authService} from './_services/AuthenticationService';
import { AiFillPropertySafety } from 'react-icons/ai';

const PrivateRoute = ({Component: component, ...rest}) => (
  <Route {...rest} render={(props) => (
    (localStorage.getItem('logged_in') === true)
      ? <Component {...props} />
      : <Redirect to='/login' login={authService}/>
  )}/>
)

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Authenticate} login={authService}/>
        <PrivateRoute exact path="/" component={Home} logout={authService.logout} />
        <PrivateRoute exact path="/classroom" component={Classroom} logout={authService.logout}/>
        <PrivateRoute exact path="/component" component={Component} logout={authService.logout}/>
        <PrivateRoute exact path="/exercise" component={Exercise} logout={authService.logout}/>
        <PrivateRoute exact path="/goal" component={Goal} logout={authService.logout}/>
        <PrivateRoute exact path="/goalDetail" component={GoalDetail} logout={authService.logout}/>
        <PrivateRoute exact path="/goalEdit" component={GoalEdit} logout={authService.logout}/>
        <PrivateRoute exact path="/goalCreate" component={GoalCreate} logout={authService.logout}/>
        <PrivateRoute exact path="/schedule" component={Schedule} logout={authService.logout}/>
        <PrivateRoute exact path="/personal" component={PersonalInfo} logout={authService.logout}/>
        <PrivateRoute exact path="/personalEdit" component={PersonalInfoEdit} logout={authService.logout}/>
        <PrivateRoute exact path="/invite" component={Invite} logout={authService.logout}/>
        <PrivateRoute exact path="/authenticate" component={Authenticate} logout={authService.logout}/>
        <PrivateRoute exact path="/admin" component={AdminHome} logout={authService.logout}/>
        <PrivateRoute exact path="/classroomCreateAdmin" component={ClassroomCreateAdmin} logout={authService.logout}/>
        <PrivateRoute exact path="/classroomEditAdmin" component={ClassroomEditAdmin} logout={authService.logout}/>
        <PrivateRoute exact path="/classroomAdmin" component={AdminClassroom} logout={authService.logout}/>
        <PrivateRoute exact path="/componentCreateAdmin" component={ComponentCreateAdmin} logout={authService.logout}/>
        <PrivateRoute exact path="/componentEditAdmin" component={ComponentEditAdmin} logout={authService.logout}/>
        <PrivateRoute exact path="/componentAdmin" component={AdminComponent} logout={authService.logout}/>
        <PrivateRoute exact path="/exerciseCreateAdmin" component={ExerciseCreateAdmin} logout={authService.logout}/>
        <PrivateRoute exact path="/exerciseEditAdmin" component={ExerciseEditAdmin} />
        <PrivateRoute exact path="/studentAdmin" component={AdminStudent} logout={authService.logout}/>
        <PrivateRoute exact path="/studentInviteAdmin" component={StudentInviteAdmin} logout={authService.logout}/>
        <PrivateRoute exact path="/workoutDetail" component={WorkoutDetail} logout={authService.logout}/>
        <PrivateRoute exact path="/studentDetailAdmin" component={StudentDetailAdmin} logout={authService.logout}/>
      </Switch>
    </Router>
  );
}

export default App;

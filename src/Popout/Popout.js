import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './Popout.css';
import Header from '../Header/Header';
import { Link } from 'react-router-dom';
import { authService } from '../_services/AuthenticationService';

class Popout extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            history: props.hist
        };

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
        
    }

    componentDidUpdate(){

    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    clearFilters(event){
        localStorage.removeItem("workoutClassroom");
        localStorage.removeItem("workoutDate");
    }

    logout(event){
        authService.logout();
        this.state.history.push("/login");
    }

    //Render the Header component to the DOM/Screen
    render(){

        return(

            <div className="popoutContainer">
                <div className="popoutWrapper">
                    <Link to={{pathname: "/", state: {goBack: false}}} className="inviteLink">
                        <button className="popoutButton">My Classrooms</button>
                    </Link>
                    <Link to={{pathname: "/goal", state: {goBack: true}}} className="goalLink" >
                        <button className="popoutButton">Goals</button>
                    </Link>
                    <Link to={{pathname: "/schedule", state: {goBack: true}}} className="scheduleLink">
                        <button className="popoutButton" onClick={e => this.clearFilters(e)}>Schedule</button>
                    </Link>
                    <Link to={{pathname: "/personal", state: {goBack: true}}} className="personalLink">
                        <button className="popoutButton">Personal Info</button>
                    </Link>
                    <Link to={{pathname: "/invite", state: {goBack: true}}} className="inviteLink">
                        <button className="popoutButton">Invites</button>
                    </Link>
                    <Link to={{pathname: "/changePassword", state: {goBack: true}}} className="inviteLink">
                        <button className="popoutButton">Change Password</button>
                    </Link>
                    <button className="popoutButton" onClick={e => this.logout(e)}>Logout</button>
                </div>
            </div>
        );
            
    }
}

export default Popout;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
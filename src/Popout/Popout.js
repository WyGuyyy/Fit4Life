import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './Popout.css';
import Header from '../Header/Header';
import { Link } from 'react-router-dom';

class Popout extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            
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

    //Render the Header component to the DOM/Screen
    render(){

        return(

            <div className="popoutContainer">
                <div className="popoutWrapper">
                    <Link to={{pathname: "/goal", state: {goBack: true}}} className="goalLink" >
                        <button className="popoutButton">Goals</button>
                    </Link>
                    <Link to={{pathname: "/schedule", state: {goBack: true}}} className="scheduleLink">
                        <button className="popoutButton">Schedule</button>
                    </Link>
                    <Link to={{pathname: "/personal", state: {goBack: true}}} className="personalLink">
                        <button className="popoutButton">Personal Info</button>
                    </Link>
                    <Link to={{pathname: "/invite", state: {goBack: true}}} className="inviteLink">
                        <button className="popoutButton">Invites</button>
                    </Link>
                    <Link to={{pathname: "/", state: {goBack: false}}} className="inviteLink">
                        <button className="popoutButton">My Classrooms</button>
                    </Link>
                </div>
            </div>
        );
            
    }
}

export default Popout;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
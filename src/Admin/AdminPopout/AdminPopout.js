import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './AdminPopout.css';
/*import Header from '../Header/Header';*/
import { Link } from 'react-router-dom';

class AdminPopout extends React.Component{
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

            <div className="popoutContainer-Admin">
                <div className="popoutWrapper-Admin">
                    <Link to={{pathname: "/goal", state: {goBack: true}}} className="goalLink-Admin" >
                        <button className="popoutButton-Admin">Goals</button>
                    </Link>
                    <Link to={{pathname: "/schedule", state: {goBack: true}}} className="scheduleLink-Admin">
                        <button className="popoutButton-Admin">Schedule</button>
                    </Link>
                    <Link to={{pathname: "/personal", state: {goBack: true}}} className="personalLink-Admin">
                        <button className="popoutButton-Admin">Personal Info</button>
                    </Link>
                    <Link to={{pathname: "/invite", state: {goBack: true}}} className="inviteLink-Admin">
                        <button className="popoutButton-Admin">Invites</button>
                    </Link>
                    <Link to={{pathname: "/", state: {goBack: false}}} className="inviteLink-Admin">
                        <button className="popoutButton-Admin">My Classrooms</button>
                    </Link>
                    <Link to={{pathname: "/Admin", state: {goBack: false}}} className="inviteLink-Admin">
                        <button className="popoutButton-Admin">Test</button>
                    </Link>
                </div>
            </div>
        );
            
    }
}

export default AdminPopout;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
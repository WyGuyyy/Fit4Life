import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './AdminPopout.css';
/*import Header from '../Header/Header';*/
import { Link } from 'react-router-dom';
import { authService } from '../../_services/AuthenticationService';

class AdminPopout extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            history: props.hist
        };

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
        authService.checkTokenValidity(this.props.history);
    }

    componentDidUpdate(){

    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    logout(event){
        authService.logout();
        this.state.history.push("login");
    }

    //Render the Header component to the DOM/Screen
    render(){

        return(

            <div className="popoutContainer-Admin">
                <div className="popoutWrapper-Admin">
                    <Link to={{pathname: "/admin", state: {goBack: false}}} className="inviteLink-Admin">
                        <button className="popoutButton-Admin">Home</button>
                    </Link>
                    <Link to={{pathname: "/personal", state: {goBack: false}}} className="inviteLink-Admin">
                        <button className="popoutButton-Admin">Personal Info</button>
                    </Link>
                    <Link to={{pathname: "/share", state: {goBack: true}}} className="inviteLink">
                        <button className="popoutButton">Share</button>
                    </Link>
                    <Link to={{pathname: "/changePassword", state: {goBack: true}}} className="inviteLink">
                        <button className="popoutButton">Change Password</button>
                    </Link>
                    <button className="popoutButton-Admin" onClick={e => this.logout(e)}>Logout</button>
                </div>
            </div>
        );
            
    }
}

export default AdminPopout;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
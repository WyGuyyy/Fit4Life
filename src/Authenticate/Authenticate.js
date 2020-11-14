import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import {authService} from '../_services/AuthenticationService';
import {passHashService} from '../_services/PasswordHasherService';
import './Authenticate.css';
import { Link } from 'react-router-dom';

class Authenticate extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            login: props.login
        };

    }

    async authenticate(event, context){

        var userRole;

        var username = document.getElementById("authenticateInputUser").value;
        var password = document.getElementById("authenticateInputPass").value;

        password = passHashService.hashPassword(password);

        var data = await authService.authenticate(username, password);
        //var isLoggedIn = localStorage.getItem('logged_in');
        var isLoggedIn = data.success;
        
        console.log(data.user.userRole);

        //if(authService.isLoggedIn().localeCompare("true") === 0){
        if(isLoggedIn.localeCompare("true") === 0){

            localStorage.setItem('userID', data.user.userID);
            localStorage.setItem('userRole', data.user.userRole);
            localStorage.setItem('userDisplayName', data.user.displayName);
            localStorage.setItem('logged_in', "true");
            localStorage.setItem('auth_token', data.user.token);

            if(data.user.userRole.localeCompare("STUDENT") === 0){
                this.props.history.push("/");
            }else{
                this.props.history.push("/admin");
            }
        }


    }
    
    goToAccountCreate(){
        this.props.history.push("/createAccount");
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

        if(localStorage.getItem("logged_in").localeCompare("true") === 0){
            if(localStorage.getItem("userRole").localeCompare("STUDENT") === 0){
                this.props.history.push("/");
            }else{
                this.props.history.push("/admin");
            }
        }

        return(

            <div className="authenticateContainer">
                <div className="authenticateWrapper">
                    <div className="authenticateForm">
                        <div className="Authenticate-Row-Container">
                            <div className="Authneticate-Fit4Life-Row">
                                <h1 className="topTitle">Fit<span style={{color: "#6b4e00"}}>4</span>Life</h1>
                            </div>
                            <div className="Authneticate-Title-Row">
                                <h2 className="authenticateTitle">LOGIN</h2>
                            </div>
                            <div className="Authneticate-Username-Row">
                                <label className="authenticateLabel">Username: </label> <input className="authenticateInput" id="authenticateInputUser"/>
                            </div>
                            <div className="Authneticate-Password-Row">
                                <label className="authenticateLabel">Password: </label> <input className="authenticateInput" id="authenticateInputPass"/>
                            </div>
                            <div className="Authneticate-Login-Row">
                                <button className="authenticateLogin" onClick={e => this.authenticate(e)}>Login</button>
                            </div>
                            <div className="Authneticate-Create-Row">
                                <button className="authenticateCreate" onClick={e => this.goToAccountCreate(e)}>Create Account</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
            
    }
}

export default Authenticate;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
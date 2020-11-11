import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import {authService} from '../_services/AuthenticationService';
import {passHashService} from '../_services/PasswordHasherService';
import './CreateAccount.css';
import { Link } from 'react-router-dom';

class CreateAccount extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            login: props.login
        };

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

    async createAccount(event){

        var user;

        var aFirstName = document.getElementById("createAccountInputFirstName").value;
        var aLastName = document.getElementById("createAccountInputLastName").value;
        var anEmail = document.getElementById("createAccountInputEmail").value;
        var aPassword = document.getElementById("createAccountInputPassword").value;
        var aConfirmedPassword = document.getElementById("createAccountInputConfirmPassword").value;

        if(!this.validateData(aFirstName, aLastName, anEmail, aPassword, aConfirmedPassword)){
            return;
        }

        var hashedPassword = passHashService.hashPassword(aPassword.trim());

        user = {first_name: aFirstName.trim(), last_name: aLastName.trim(), email: anEmail.trim(), password_hash: hashedPassword};

        await fetch("http://localhost:8080/api/createaccount", {  
            method: "POST",
            body: JSON.stringify(user),                          
            headers: {"Content-Type": "application/json"}
        }).catch(console.log);

        document.getElementById("createAccountInputFirstName").value = "";
        document.getElementById("createAccountInputLastName").value = "";
        document.getElementById("createAccountInputEmail").value = "";
        document.getElementById("createAccountInputPassword").value = "";
        document.getElementById("createAccountInputConfirmPassword").value = "";

        //Here show confirm box to take them back to login screen -> this.props.history.push("/login");
        //May need to do email confirmation to avoid other students creating account
        //Also need to create back to login button on form
        //then to to make create account form responsive

    }

    validateData(firstName, lastName, email, password, confirmedPassword){

        if(firstName.trim().localeCompare("") === 0){
            return false;
        }

        if(lastName.trim().localeCompare("") === 0){
            return false;
        }

        if(email.trim().localeCompare("") === 0){
            return false;
        }

        if(password.trim().localeCompare("") === 0){
            return false;
        }

        if(confirmedPassword.trim().localeCompare("") === 0){
            return false;
        }

        if(!this.emailExists(email)){
            return false;
        }

        if(!(password.localeCompare(confirmedPassword) === 0)){
            return false;
        }

        return true;

    }

    emailExists(email){
        return true;
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

            <div className="createAccountContainer">
                <div className="createAccountWrapper">
                    <div className="createAccountForm">
                        <div className="CreateAccount-Row-Container">
                            <div className="CreateAccount-Title-Row">
                                <h2 className="createAccountTitle">Create Account</h2>
                            </div>
                            <div className="CreateAccount-FirstName-Row">
                                <label className="createAccountLabel">First Name: </label> <input className="createAccountInput" id="createAccountInputFirstName"/>
                            </div>
                            <div className="CreateAccount-LastName-Row">
                                <label className="createAccountLabel">Last Name: </label> <input className="createAccountInput" id="createAccountInputLastName"/>
                            </div>
                            <div className="CreateAccount-Email-Row">
                                <label className="createAccountLabel">Email: </label> <input className="createAccountInput" id="createAccountInputEmail"/>
                            </div>
                            <div className="CreateAccount-Password-Row">
                                <label className="createAccountLabel">Password: </label> <input className="createAccountInput" id="createAccountInputPassword" type="password"/>
                            </div>
                            <div className="CreateAccount-ConfirmPassword-Row">
                                <label className="createAccountLabel">Confirm Password: </label> <input className="createAccountInput" id="createAccountInputConfirmPassword" type="password"/>
                            </div>
                            <div className="CreateAccount-CreateButton-Row">
                                <button className="createAccountCreate" onClick={e => this.createAccount(e)}>Create</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
            
    }
}

export default CreateAccount;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
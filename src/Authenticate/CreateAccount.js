import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import {authService} from '../_services/AuthenticationService';
import {passHashService} from '../_services/PasswordHasherService';
import CreateConfirm from '../Confirm/ConfirmCreate';
import ConfirmToast from '../Confirm/ConfirmToast';
import ConfirmModal from '../Confirm/ConfirmModal';
import './CreateAccount.css';
import { Link } from 'react-router-dom';
import { MdTransferWithinAStation } from 'react-icons/md';
import {baseURI} from '../_services/APIService';

class CreateAccount extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            login: props.login
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

    async createAccount(event){

        var user;

        var aFirstName = document.getElementById("createAccountInputFirstName").value;
        var aLastName = document.getElementById("createAccountInputLastName").value;
        var anEmail = document.getElementById("createAccountInputEmail").value;
        var aDisplayName = document.getElementById("createAccountInputDisplayName").value;
        var aPassword = document.getElementById("createAccountInputPassword").value;
        var aConfirmedPassword = document.getElementById("createAccountInputConfirmPassword").value;

        if(!this.validateData(aFirstName, aLastName, anEmail, aDisplayName, aPassword, aConfirmedPassword)){
            return;
        }

        var hashedPassword = passHashService.hashPassword(aPassword.trim());

        user = {first_name: aFirstName.trim(), last_name: aLastName.trim(), email: anEmail.trim(), display_name: aDisplayName.trim(), password_hash: hashedPassword};

        console.log(user);

        await fetch(baseURI + "/api/createaccount", {  
            method: "POST",
            body: JSON.stringify(user),                          
            headers: {"Content-Type": "application/json"}
        }).catch(console.log);

        document.getElementById("createAccountInputFirstName").value = "";
        document.getElementById("createAccountInputLastName").value = "";
        document.getElementById("createAccountInputEmail").value = "";
        document.getElementById("createAccountInputPassword").value = "";
        document.getElementById("createAccountInputConfirmPassword").value = "";


        this.showModal();
        this.confirmBackendTransaction();

        //May need to do email confirmation to avoid other students creating account

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

    showModal(){
        document.getElementById("confirmCreateContainer").style.display = "flex";
    }

    showConfirmModal(){
        document.getElementById("modalContainer").style.display = "flex";
    }

    closeModal(){
        document.getElementById("confirmCreateContainer").style.display = "none";
        this.props.history.push("/login");
    }

    closeConfirmModal(){
        document.getElementById("modalContainer").style.display = "none";
    }

    confirmBackendTransaction(){
        // Get the snackbar confirmation
        var confirmation = document.getElementById("snackbar");
        confirmation.className = "show";
        setTimeout(function(){ confirmation.className = confirmation.className.replace("show", ""); }, 3000);
    }

    backToLogin(){
        this.props.history.push("/login");
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
                <CreateConfirm confirm={e => {this.closeModal()}} btnText={"Lets get fit!"} text={"Account created!"}/>
                <ConfirmModal text="Confirm account creation?" yesText="Yes" noText="No" onYes={e => {this.closeConfirmModal(); this.createAccount(e)}} />
                <div className="createAccountWrapper">
                    <ConfirmToast text="Account Created!"/>
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
                            <div className="CreateAccount-DisplayName-Row">
                                <label className="createAccountLabel">Display Name: </label> <input className="createAccountInput" id="createAccountInputDisplayName"/>
                            </div>
                            <div className="CreateAccount-Password-Row">
                                <label className="createAccountLabel">Password: </label> <input className="createAccountInput" id="createAccountInputPassword" type="password"/>
                            </div>
                            <div className="CreateAccount-ConfirmPassword-Row">
                                <label className="createAccountLabel">Confirm Password: </label> <input className="createAccountInput" id="createAccountInputConfirmPassword" type="password"/>
                            </div>
                            <div className="CreateAccount-CreateButton-Row">
                                <button className="createAccountCreate" onClick={e => this.showConfirmModal(e)}>Create</button>
                            </div>
                            <div className="CreateAccount-CancelButton-Row">
                                <button className="createAccountCancel" onClick={e => this.backToLogin(e)}>Cancel</button>
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
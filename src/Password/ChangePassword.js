import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './ChangePassword.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout';
import ConfirmModal from '../Confirm/ConfirmModal';
import ConfirmToast from '../Confirm/ConfirmToast';
import { Link } from 'react-router-dom';
import {authService, AuthService} from '../_services/AuthenticationService';
import {passHashService} from '../_services/PasswordHasherService';

class ChangePassword extends React.Component{
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

    showModal(){
        document.getElementById("modalContainer").style.display = "flex";
    }

    closeModal(){
        document.getElementById("modalContainer").style.display = "none";
    }

    confirmBackendTransaction(){
        // Get the snackbar confirmation
        var confirmation = document.getElementById("snackbar");
        confirmation.textContent = "Password changed!";
        confirmation.className = "show";
        setTimeout(function(){ confirmation.className = confirmation.className.replace("show", ""); }, 3000);
    }

    showError(){
        // Get the snackbar confirmation
        var confirmation = document.getElementById("snackbar");
        confirmation.textContent = "Either old password is incorrect or new password fields do no match! Please try again!";
        confirmation.className = "show";
        setTimeout(function(){ confirmation.className = confirmation.className.replace("show", ""); }, 3000);
    }

    async changePassword(event){

        var oldPassword = document.getElementById("ChangePassword-Input-OldPassword").value;
        var newPassword = document.getElementById("ChangePassword-Input-NewPassword").value;
        var confirmNewPassword = document.getElementById("ChangePassword-Input-ConfirmNewPassword").value;

        var hashedPassword = passHashService.hashPassword(oldPassword);

        var data = await authService.authenticate(localStorage.getItem("userEmail"), hashedPassword);

        if(!(oldPassword.localeCompare(newPassword) === 0) && 
        (newPassword.localeCompare(confirmNewPassword) === 0) && data.success.localeCompare("true") === 0){

            var hashedPassword = passHashService.hashPassword(newPassword);

            var user = "";

            await fetch("http://localhost:8080/api/user/" + localStorage.getItem("userID"), {  
                method: "GET",                          
                headers: {"Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("auth_token")}
                })
                .then(res => res.text())
                .then(
                    (text) => {
                        var result = text.length ? JSON.parse(text) : {};
                        user = result;
                    }
                ).catch(console.log);

            user.password_hash = hashedPassword;

            await fetch("http://localhost:8080/api/user", {  
                method: "POST",                          
                headers: {"Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("auth_token")},
                body: JSON.stringify(user) 
            }).catch(console.log);

            document.getElementById("ChangePassword-Input-OldPassword").value = "";
            document.getElementById("ChangePassword-Input-NewPassword").value = "";
            document.getElementById("ChangePassword-Input-ConfirmNewPassword").value = "";

            this.confirmBackendTransaction();
        }else{
            this.showError();
        }
    
    }

    goBack(){ //This isnt working, start here next time
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }

    //Render the Header component to the DOM/Screen
    render(){

        /*if(localStorage.getItem("logged_in").localeCompare("true") === 0){
            if(localStorage.getItem("userRole").localeCompare("STUDENT") === 0){
                this.props.history.push("/");
            }else{
                this.props.history.push("/admin");
            }
        }*/

        return(

            <Fragment>
                <Header title={"Change Password"} breadCrumbs={"Change Password"} goBack={true} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Confirm password change?" yesText="Yes" noText="No" onYes={e => {this.changePassword(); this.closeModal();}}/>
                <div className="changePasswordContainer">
                    <Popout hist={this.props.history}/>
                    <div className="changePasswordWrapper">
                        <ConfirmToast text="Password changed!"/>
                        <div className="changePasswordForm">
                            <div className="ChangePassword-Title-Row">
                                <h2 className="ChangePassword-Form-Title">Change Password</h2>
                            </div>
                            <div className="ChangePassword-Form-Wrapper">
                                <div className="ChangePassword-Details-Row">
                                    <label className="changePasswordLabel">Old Password: </label> <input className="changePasswordInput" id="ChangePassword-Input-OldPassword" type="password" maxLength="30"/>
                                </div>
                                <div className="ChangePassword-Details-Row">
                                    <label className="changePasswordLabel">New Password: </label> <input className="changePasswordInput" id="ChangePassword-Input-NewPassword" type="password" maxLength="30"/>
                                </div>
                                <div className="ChangePassword-Details-Row">
                                    <label className="changePasswordLabel">Confirm New Password: </label> <input className="changePasswordInput" id="ChangePassword-Input-ConfirmNewPassword" type="password" maxLength="30"/>
                                </div>
                                <div className="ChangePassword-Change-Row">
                                    <button className="changePasswordChange" onClick={(e) => this.showModal(e)}>Change</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default ChangePassword;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './PersonalInfoEdit.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout';
import ConfirmModal from '../Confirm/ConfirmModal';
import ConfirmToast from '../Confirm/ConfirmToast';
import AdminHeader from '../Admin/AdminHeader/AdminHeader';
import AdminPopout from '../Admin/AdminPopout/AdminPopout';
import { Link } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import {RedirectService} from '../_services/RedirectService';
import {DataCheckService} from '../_services/DataCheckService';
import {authService} from '../_services/AuthenticationService';
import {baseURI} from '../_services/APIService';

class PersonalInfoEdit extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                canGoBack: props.location.state.goBack,
                personalInfoObject: ""
            };
        }

        this.getPersonalInfo();

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
        //this.fillFields();
    }

    componentDidUpdate(){

    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    async getPersonalInfo(){

        var personalInfo;

        await fetch(baseURI + "/api/user/" + localStorage.getItem("userID"), {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                personalInfo = result;
            }
        ).catch(console.log);

            this.setState({
                personalInfoObject: personalInfo
            });

    }

    async savePersonalInfo(eventObj){

        var newFirstName = document.getElementById("Personal-Info-Edit-First-Name-Input").value;
        var newLastName = document.getElementById("Personal-Info-Edit-Last-Name-Input").value;
        var newDisplayName = document.getElementById("Personal-Info-Edit-DisplayName-Input").value;
        var newEmail = localStorage.getItem("userEmail");
        var newWeight = document.getElementById("Personal-Info-Edit-Weight-Input").value;
        var newHeightFeet = document.getElementById("Personal-Info-Edit-Height-Feet-Input").value;
        var newHeightInches = document.getElementById("Personal-Info-Edit-Height-Inches-Input").value;

        if(DataCheckService.validateFields([newFirstName, newLastName, newDisplayName, newEmail, newWeight, newHeightFeet, newHeightInches])){

            await fetch(baseURI + "/api/user", {  
                method: "PUT",                          
                headers: {"Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("auth_token")},
                body: JSON.stringify({user_id: this.state.personalInfoObject.user_id, first_name: newFirstName, last_name: newLastName, display_name: newDisplayName, email: newEmail, weight: newWeight, height_feet: newHeightFeet, height_inches: newHeightInches, access_type: this.state.personalInfoObject.access_type, password_hash: this.state.personalInfoObject.password_hash}) //Need to add in other fields here, back end and front end
            }).catch(console.log);

            this.confirmBackendTransaction();

        }else{
            this.showError();
        }

    }

    showModal(event){
        document.getElementById("modalContainer").style.display = "flex";
    }

    closeModal(){
        document.getElementById("modalContainer").style.display = "none";
    }

    showError(){
        // Get the snackbar confirmation
        var confirmation = document.getElementById("snackbar");
        confirmation.innerText = "There are empty fields! Please fill all fields!";
        confirmation.className = "show";
        setTimeout(function(){ confirmation.className = confirmation.className.replace("show", ""); }, 3000);
    }

    confirmBackendTransaction(){
        // Get the snackbar confirmation
        var confirmation = document.getElementById("snackbar");
        confirmation.innerText = "Personal information saved!";
        confirmation.className = "show";
        setTimeout(function(){ confirmation.className = confirmation.className.replace("show", ""); }, 3000);
    }

    goBack(){ //This isnt working, start here next time
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }

    cancelEdit(){
        this.props.history.push({pathname: "personal", state: {goBack: true}});
    }

    //Render the Header component to the DOM/Screen
    render(){

        if(!RedirectService.checkItemForUndefined(this.props.location.state)){
            return RedirectService.decideRedirect();
        }

        return(
            <Fragment>
                {localStorage.getItem("userRole").localeCompare("STUDENT") === 0 ? 
                <Header title="Edit Personal Info" breadCrumbs="Edit Personal Info" goBack={true} customClick={this.goBack.bind(this)}/> : 
                <AdminHeader title={"Edit Personal Info"} breadCrumbs="Edit Personal Info" goBack={false} customClick={this.goBack.bind(this)}/>}
                <ConfirmModal text="Save information?" yesText="Yes" noText="No" onYes={e => {this.savePersonalInfo(); this.closeModal();}}/>
                <div className="Personal-Info-Edit-Container">
                     {localStorage.getItem("userRole").localeCompare("STUDENT") === 0 ? 
                     <Popout hist={this.props.history}/> : 
                     <AdminPopout hist={this.props.history}/>}
                    <div className="Personal-Info-Edit-Wrapper" id="Personal-Info-Edit-Wrapper">
                        <ConfirmToast text="Personal information saved!"/>
                        <div className="Personal-Info-Edit-Form-Wrapper">

                            <div className="Personal-Info-Edit-Title-Wrapper">
                                <h2 className="Personal-Info-Edit-Form-Title">My Information</h2>
                            </div>

                            <div className="Personal-Info-Edit-First-Name-Wrapper">
                                <label className="Personal-Info-Edit-First-Name-Label">First Name: </label> <input className="Personal-Info-Edit-First-Name-Input" id="Personal-Info-Edit-First-Name-Input" type="text" defaultValue={this.state.personalInfoObject.first_name} maxLength="30"/>
                            </div>

                            <div className="Personal-Info-Edit-Last-Name-Wrapper">
                                <label className="Personal-Info-Edit-Last-Name-Label">Last Name: </label> <input className="Personal-Info-Edit-Last-Name-Input" id="Personal-Info-Edit-Last-Name-Input" type="text" defaultValue={this.state.personalInfoObject.last_name} maxLength="30"/>
                            </div>

                            <div className="Personal-Info-Edit-DisplayName-Wrapper">
                                <label className="Personal-Info-Edit-DisplayName-Label">Display Name: </label> <input className="Personal-Info-Edit-DisplayName-Input" id="Personal-Info-Edit-DisplayName-Input" type="text" defaultValue={this.state.personalInfoObject.display_name} maxLength="30"/>
                            </div>

                            <div className="Personal-Info-Edit-Email-Wrapper">
                                <label className="Personal-Info-Edit-Email-Label">Email: </label> <h2 className="Personal-Info-Edit-Email-Input" id="Personal-Info-Edit-Email-Input" type="text">{this.state.personalInfoObject.email}</h2>
                            </div>

                            <div className="Personal-Info-Edit-Weight-Wrapper">
                                <label className="Personal-Info-Edit-Weight-Label">Weight: </label> <input className="Personal-Info-Edit-Weight-Input" id="Personal-Info-Edit-Weight-Input" type="number" defaultValue={this.state.personalInfoObject.weight} maxLength="4"/>
                            </div>

                            <div className="Personal-Info-Edit-Height-Wrapper">
                                <label className="Personal-Info-Edit-Height-Label">Height: </label> <div className="Personal-Info-Edit-Height-Input-Wrapper"> <input className="Personal-Info-Edit-Height-Feet-Input" id="Personal-Info-Edit-Height-Feet-Input" type="number" defaultValue={this.state.personalInfoObject.height_feet} /> <input className="Personal-Info-Edit-Height-Inches-Input" id="Personal-Info-Edit-Height-Inches-Input" type="number" defaultValue={this.props.location.state.personalInfo.height_inches} /> </div>
                            </div>

                            <div className="Personal-Info-Edit-Submit-Wrapper">
                                 <button className="Personal-Info-Edit-Cancel-Button" onClick={e => this.cancelEdit()}>Cancel</button> <button className="Personal-Info-Edit-Save-Button" onClick={(e) => this.showModal(e)}>Save</button>
                            </div>

                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default PersonalInfoEdit;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './PersonalInfoEdit.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout';
import ConfirmModal from '../Confirm/ConfirmModal';
import ConfirmToast from '../Confirm/ConfirmToast';
import { Link } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';

class PersonalInfoEdit extends React.Component{
    constructor(props){
        super(props);

        this.state = {
           canGoBack: props.location.state.goBack,
           personalInfoObject: props.location.state.personalInfo
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

    async savePersonalInfo(eventObj){

        var newFirstName = document.getElementById("Personal-Info-Edit-First-Name-Input").value;
        var newLastName = document.getElementById("Personal-Info-Edit-Last-Name-Input").value;
        var newEmail = document.getElementById("Personal-Info-Edit-Email-Input").value;
        var newWeight = document.getElementById("Personal-Info-Edit-Weight-Input").value;
        var newHeightFeet = document.getElementById("Personal-Info-Edit-Height-Feet-Input").value;
        var newHeightInches = document.getElementById("Personal-Info-Edit-Height-Inches-Input").value;

        await fetch("http://localhost:8080/api/user", {  
            method: "PUT",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")},
            body: JSON.stringify({user_id: this.state.personalInfoObject.user_id, first_name: newFirstName, last_name: newLastName, email: newEmail, weight: newWeight, height_feet: newHeightFeet, height_inches: newHeightInches, access_type: this.state.personalInfoObject.access_type, password_hash: this.state.personalInfoObject.password_hash}) //Need to add in other fields here, back end and front end
        }).catch(console.log);

    }

    showModal(event){
        document.getElementById("modalContainer").style.display = "flex";
    }

    closeModal(){
        document.getElementById("modalContainer").style.display = "none";
    }

    confirmBackendTransaction(){
        // Get the snackbar confirmation
        var confirmation = document.getElementById("snackbar");
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

        return(
            <Fragment>
                <Header title="Edit Personal Info" breadCrumbs="Edit Personal Info" goBack={true} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Save information?" yesText="Yes" noText="No" onYes={e => {this.savePersonalInfo(); this.closeModal(); this.confirmBackendTransaction();}}/>
                <div className="Personal-Info-Edit-Container">
                    <Popout />
                    <div className="Personal-Info-Edit-Wrapper" id="Personal-Info-Edit-Wrapper">
                        <ConfirmToast text="Personal information saved!"/>
                        <div className="Personal-Info-Edit-Form-Wrapper">

                            <div className="Personal-Info-Edit-Title-Wrapper">
                                <h2 className="Personal-Info-Edit-Form-Title">My Information</h2>
                            </div>

                            <div className="Personal-Info-Edit-First-Name-Wrapper">
                                <label className="Personal-Info-Edit-First-Name-Label">First Name: </label> <input className="Personal-Info-Edit-First-Name-Input" id="Personal-Info-Edit-First-Name-Input" type="text" defaultValue={this.props.location.state.personalInfo.first_name}/>
                            </div>

                            <div className="Personal-Info-Edit-Last-Name-Wrapper">
                                <label className="Personal-Info-Edit-Last-Name-Label">Last Name: </label> <input className="Personal-Info-Edit-Last-Name-Input" id="Personal-Info-Edit-Last-Name-Input" type="text" defaultValue={this.props.location.state.personalInfo.last_name}/>
                            </div>

                            <div className="Personal-Info-Edit-Email-Wrapper">
                                <label className="Personal-Info-Edit-Email-Label">Email: </label> <input className="Personal-Info-Edit-Email-Input" id="Personal-Info-Edit-Email-Input" type="text" defaultValue={this.props.location.state.personalInfo.email}/>
                            </div>

                            <div className="Personal-Info-Edit-Weight-Wrapper">
                                <label className="Personal-Info-Edit-Weight-Label">Weight: </label> <input className="Personal-Info-Edit-Weight-Input" id="Personal-Info-Edit-Weight-Input" type="text" defaultValue={this.props.location.state.personalInfo.weight}/>
                            </div>

                            <div className="Personal-Info-Edit-Height-Wrapper">
                                <label className="Personal-Info-Edit-Height-Label">Height: </label> <div className="Personal-Info-Edit-Height-Input-Wrapper"> <input className="Personal-Info-Edit-Height-Feet-Input" id="Personal-Info-Edit-Height-Feet-Input" type="text" defaultValue={this.props.location.state.personalInfo.height_feet}/> <input className="Personal-Info-Edit-Height-Inches-Input" id="Personal-Info-Edit-Height-Inches-Input" type="text" defaultValue={this.props.location.state.personalInfo.height_inches}/> </div>
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
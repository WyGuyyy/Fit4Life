import React, { Fragment } from 'react';
import './ComponentEditAdmin.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout';
import ConfirmModal from '../../Confirm/ConfirmModal';
import ConfirmToast from '../../Confirm/ConfirmToast';
import { Link } from 'react-router-dom';
import {RedirectService} from '../../_services/RedirectService';
import {DataCheckService} from '../../_services/DataCheckService';
import {baseURI} from '../../_services/APIService';
import {authService} from '../../_services/AuthenticationService';

class ComponentEditAdmin extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                canGoBack: true,
                title: props.location.state.title,
                component: props.location.state.component,
                classroom: props.location.state.classroom,
                componentObject: ""
            }

            this.getComponent();
        }

    }
    
    componentDidMount(){ 
        authService.checkTokenValidity(this.props.history);
    }

    componentWillUnmount(){
        
    }

    async getComponent(){

        var component;

        await fetch(baseURI + "/api/component/" + this.props.location.state.component.component_id, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                component = result;
            }
        ).catch(console.log);


        this.setState({
            componentObject: component
        });



    }

    async editComponent(event){

        var componentID = this.state.component.component_id;
        var classroomID = this.state.classroom.classroom_id;
        var aTitle = document.getElementById("Component-Edit-Title-Input-Admin").value;

        if(DataCheckService.validateFields([aTitle])){

            await fetch(baseURI + "/api/component", {  
                method: "PUT",                          
                headers: {"Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("auth_token")},
                body: JSON.stringify({component_id: componentID, title: aTitle.trim(), classroom: {classroom_id: classroomID}}) //Need to add in other fields here, back end and front end
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
        confirmation.innerText = "Component saved!";
        confirmation.className = "show";
        setTimeout(function(){ confirmation.className = confirmation.className.replace("show", ""); }, 3000);
    }

    cancelEdit(){
        this.props.history.push({pathname: "classroomAdmin", state: {goBack: true, classroom: this.state.classroom}});
    }
    
    goBack(){ //This isnt working, start here next time
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }
    
    render(){

        if(!RedirectService.checkItemForUndefined(this.props.location.state)){
            return RedirectService.decideRedirect();
        }

        var component = this.state.componentObject;

        return(
            <Fragment>
                <AdminHeader title={"Component Edit"} breadCrumbs={"Edit Component for " + component.title} goBack={true} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Save component?" yesText="Yes" noText="No" onYes={e => {this.editComponent(); this.closeModal();}}/>
                <div className="Component-Edit-Container-Admin">
                    <AdminPopout hist={this.props.history}/>
                    <div className="Component-Edit-Wrapper-Admin">
                        <ConfirmToast text="Component saved!"/>
                        <div className="Component-Edit-Form-Wrapper-Admin">
                            <div className="Component-Edit-Title-Wrapper-Admin">
                                <label className="Component-Edit-Title-Label-Admin">Component Title: </label> <input className="Component-Edit-Title-Input-Admin" id="Component-Edit-Title-Input-Admin" defaultValue={component.title}  maxLength="50"/>
                            </div>
                            <div className="Component-Edit-Button-Area-Admin"> 
                                <button className="Component-Edit-Save-Button-Admin" onClick={e => this.showModal(e)}>Save</button>
                                <button className="Component-Edit-Cancel-Button-Admin" onClick={e => this.cancelEdit()}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default ComponentEditAdmin;


//"react-router-dom": "^6.0.0-alpha.1",
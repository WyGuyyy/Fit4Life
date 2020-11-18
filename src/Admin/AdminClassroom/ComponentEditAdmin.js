import React, { Fragment } from 'react';
import './ComponentEditAdmin.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout';
import ConfirmModal from '../../Confirm/ConfirmModal';
import ConfirmToast from '../../Confirm/ConfirmToast';
import { Link } from 'react-router-dom';
import {RedirectService} from '../../_services/RedirectService';

class ComponentEditAdmin extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                canGoBack: true,
                title: props.location.state.title,
                component: props.location.state.component,
                classroom: props.location.state.classroom
            }
        }

    }
    
    componentDidMount(){ 
        
    }

    componentWillUnmount(){
        
    }

    async editComponent(event){

        var componentID = this.state.component.component_id;
        var classroomID = this.state.classroom.classroom_id;
        var aTitle = document.getElementById("Component-Edit-Title-Input-Admin").value;

        await fetch("http://localhost:8080/api/component", {  
            method: "PUT",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")},
            body: JSON.stringify({component_id: componentID, title: aTitle, classroom: {classroom_id: classroomID}}) //Need to add in other fields here, back end and front end
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

    cancelEdit(){
        this.props.history.push({pathname: "classroomAdmin", state: {goBack: true}});
    }
    
    goBack(){ //This isnt working, start here next time
        console.log(this.props);
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }
    
    render(){

        if(!RedirectService.checkItemForUndefined(this.props.location.state)){
            return RedirectService.decideRedirect();
        }

        var classroom = this.props.location.state.classroom.title;

        return(
            <Fragment>
                <AdminHeader title={"Component Edit"} breadCrumbs={"Edit Component for " + classroom} goBack={true} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Save component?" yesText="Yes" noText="No" onYes={e => {this.editComponent(); this.closeModal(); this.confirmBackendTransaction();}}/>
                <div className="Component-Edit-Container-Admin">
                    <AdminPopout hist={this.props.history}/>
                    <div className="Component-Edit-Wrapper-Admin">
                        <ConfirmToast text="Component saved!"/>
                        <div className="Component-Edit-Form-Wrapper-Admin">
                            <div className="Component-Edit-Title-Wrapper-Admin">
                                <label className="Component-Edit-Title-Label-Admin">Component Title: </label> <input className="Component-Edit-Title-Input-Admin" id="Component-Edit-Title-Input-Admin" defaultValue={this.props.location.state.component.title}  maxLength="30"/>
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
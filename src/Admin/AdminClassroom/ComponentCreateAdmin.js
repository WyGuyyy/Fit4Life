import React, { Fragment } from 'react';
import './ComponentCreateAdmin.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout';
import ConfirmModal from '../../Confirm/ConfirmModal';
import ConfirmToast from '../../Confirm/ConfirmToast';
import { Link, Redirect } from 'react-router-dom';
import {RedirectService} from '../../_services/RedirectService';

class ComponentCreateAdmin extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                canGoBack: true,
                classroom: props.location.state.classroom
            }
        }

    }
    
    componentDidMount(){ 
        
    }

    componentWillUnmount(){
        
    }

    async createComponent(event){

        var aTitle = document.getElementById("Component-Create-Title-Input-Admin").value;

        var classroomID = this.state.classroom.classroom_id;
        var componentID;

        await fetch("http://localhost:8080/api/component", {  
            method: "POST",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")},
            body: JSON.stringify({title: aTitle, classroom: {classroom_id: classroomID}}) //Need to add in other fields here, back end and front end
        }).then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                componentID = result;
            }
        ).catch(console.log);


        /*await fetch("http://localhost:8080/api/component/toclass/" + componentID + "/" + classroomID, {  
            method: "POST",                          
            headers: {"Content-Type": "application/json"}
        }).catch(console.log);*/

        document.getElementById("Component-Create-Title-Input-Admin").value = "";

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

    cancelCreate(){
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
                <AdminHeader title={"Component Create"} breadCrumbs={"Create component for " + classroom} goBack={true} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Create component?" yesText="Yes" noText="No" onYes={e => {this.createComponent(); this.closeModal(); this.confirmBackendTransaction();}}/>
                <div className="Component-Create-Container-Admin">
                    <AdminPopout hist={this.props.history}/>
                    <div className="Component-Create-Wrapper-Admin">
                        <ConfirmToast text="Component created!"/>
                        <div className="Component-Create-Form-Wrapper-Admin">
                            <div className="Component-Create-Title-Wrapper-Admin">
                                <label className="Component-Create-Title-Label-Admin">Component Title: </label> <input className="Component-Create-Title-Input-Admin" id="Component-Create-Title-Input-Admin" placeholder="Title..."/>
                            </div>
                            <div className="Component-Create-Button-Area-Admin"> 
                                <button className="Component-Create-Save-Button-Admin" onClick={(e) => this.showModal(e)}>Create</button>
                                <button className="Component-Create-Cancel-Button-Admin" onClick={e => this.cancelCreate()}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default ComponentCreateAdmin;


//"react-router-dom": "^6.0.0-alpha.1",
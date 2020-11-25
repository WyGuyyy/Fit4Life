import React, { Fragment } from 'react';
import './ClassroomEditAdmin.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout';
import ConfirmModal from '../../Confirm/ConfirmModal';
import ConfirmToast from '../../Confirm/ConfirmToast';
import { Link } from 'react-router-dom';
import {RedirectService} from '../../_services/RedirectService';
import {DataCheckService} from '../../_services/DataCheckService';
import {baseURI} from '../../_services/APIService';

class ClassroomEditAdmin extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                canGoBack: true,
                classroom: props.location.state.classroom,
                classroomObject: ""
            }

            this.getClassroom();

        }
    }
    
    componentDidMount(){ 
        
    }

    componentWillUnmount(){
        
    }

    async getClassroom(){

        var classroom;

        await fetch(baseURI + "/api/classroom/" + this.props.location.state.classroom.classroom_id, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                classroom = result;
            }
        ).catch(console.log);

        this.setState({
            classroomObject: classroom
        });



    }

    async editClassroom(event){

        var classroomID = this.state.classroom.classroom_id;
        var aTitle = document.getElementById("Classroom-Edit-Title-Input-Admin").value;
        var aTeacherID = localStorage.getItem("userID");

        if(DataCheckService.validateFields([aTitle])){        

            await fetch(baseURI + "/api/classroom", {  
                method: "PUT",                          
                headers: {"Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("auth_token")},
                body: JSON.stringify({classroom_id: classroomID, title: aTitle, teacher: {user_id: aTeacherID}}) 
            }).catch(console.log);

            this.confirmBackendTransaction();

        }else{
            this.showError();
        }

        //document.getElementById("modalContainer").style.display = "none";

        // Get the snackbar confirmation
        /*var confirmation = document.getElementById("snackbar");
        confirmation.className = "show";
        setTimeout(function(){ confirmation.className = confirmation.className.replace("show", ""); }, 3000);*/

        /*document.getElementById("Goal-Edit-Title-Input").value = "";
        document.getElementById("notStarted").checked = false;
        document.getElementById("inProgress").checked = false;
        document.getElementById("complete").checked = false;
        document.getElementById("Goal-Edit-Description-TextArea").value = "";*/

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
        confirmation.className = "show";
        setTimeout(function(){ confirmation.className = confirmation.className.replace("show", ""); }, 3000);
    }

    cancelEdit(){
        this.props.history.push({pathname: "admin", state: {goBack: false}});
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

        var classroom = this.state.classroomObject;

        return(
            <Fragment>
                <AdminHeader title="Classroom Edit" breadCrumbs={"Edit " + classroom.title} goBack={true} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Save classroom?" yesText="Yes" noText="No" onYes={e => {this.editClassroom(); this.closeModal();}}/>
                <div className="Classroom-Edit-Container-Admin">
                    <AdminPopout hist={this.props.history}/>
                    <div className="Classroom-Edit-Wrapper-Admin">
                        <ConfirmToast text="Classroom saved!" />
                        <div className="Classroom-Edit-Form-Wrapper-Admin">
                            <div className="Classroom-Edit-Title-Wrapper-Admin">
                                <label className="Classroom-Edit-Title-Label-Admin">Classroom Title: </label> <input className="Classroom-Edit-Title-Input-Admin" id="Classroom-Edit-Title-Input-Admin" defaultValue={classroom.title} maxLength="50"/>
                            </div>
                            <div className="Classroom-Edit-Button-Area-Admin"> 
                                <button className="Classroom-Edit-Save-Button-Admin" onClick={e => this.showModal(e)}>Save</button>
                                <button className="Classroom-Edit-Cancel-Button-Admin" onClick={e => this.cancelEdit()}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default ClassroomEditAdmin;


//"react-router-dom": "^6.0.0-alpha.1",
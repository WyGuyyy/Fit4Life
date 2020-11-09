import React, { Fragment } from 'react';
import './ClassroomEditAdmin.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout';
import ConfirmModal from '../../Confirm/ConfirmModal';
import ConfirmToast from '../../Confirm/ConfirmToast';
import { Link } from 'react-router-dom';

class ClassroomEditAdmin extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            canGoBack: true,
            classroom: props.location.state.classroom
        }

    }
    
    componentDidMount(){ 
        
    }

    componentWillUnmount(){
        
    }

    async editClassroom(event){

        console.log("ran");

        var classroomID = this.state.classroom.classroom_id;
        var aTitle = document.getElementById("Classroom-Edit-Title-Input-Admin").value;

        await fetch("http://localhost:8080/api/classroom", {  
            method: "PUT",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")},
            body: JSON.stringify({classroom_id: classroomID, title: aTitle}) //Need to add in other fields here, back end and front end
        }).catch(console.log);

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
        console.log(this.props);
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }
    
    render(){

        var classroom = this.props.location.state.classroom.title;

        return(
            <Fragment>
                <AdminHeader title="Classroom Edit" breadCrumbs={"Edit " + classroom} goBack={true} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Save classroom?" yesText="Yes" noText="No" onYes={e => {this.editClassroom(); this.closeModal(); this.confirmBackendTransaction();}}/>
                <div className="Classroom-Edit-Container-Admin">
                    <AdminPopout />
                    <div className="Classroom-Edit-Wrapper-Admin">
                        <ConfirmToast text="Classroom saved!" />
                        <div className="Classroom-Edit-Form-Wrapper-Admin">
                            <div className="Classroom-Edit-Title-Wrapper-Admin">
                                <label className="Classroom-Edit-Title-Label-Admin">Classroom Title: </label> <input className="Classroom-Edit-Title-Input-Admin" id="Classroom-Edit-Title-Input-Admin" defaultValue={this.props.location.state.classroom.title}/>
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
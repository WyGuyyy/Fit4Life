import React, { Fragment } from 'react';
import './ClassroomCreateAdmin.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout';
import ConfirmModal from '../../Confirm/ConfirmModal';
import ConfirmToast from '../../Confirm/ConfirmToast';
import { Link } from 'react-router-dom';
import {DataCheckService} from '../../_services/DataCheckService';

class ClassroomCreateAdmin extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            canGoBack: true
        }

    }
    
    componentDidMount(){ 
        
    }

    componentWillUnmount(){
        
    }

    async createClassroom(event){

        var aTitle = document.getElementById("Classroom-Create-Title-Input-Admin").value;

        if(DataCheckService.validateFields([aTitle])){

            await fetch("http://localhost:8080/api/classroom", {  
                method: "POST",                          
                headers: {"Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("auth_token")},
                body: JSON.stringify({title: aTitle}) //Need to add in other fields here, back end and front end
            }).catch(console.log);

        }else{
            //Error Message toast here
        }

        document.getElementById("Classroom-Create-Title-Input-Admin").value = "";

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
        this.props.history.push({pathname: "admin", state: {goBack: false}});
    }
    
    goBack(){ //This isnt working, start here next time
        console.log(this.props);
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }
    
    render(){

        return(
            <Fragment>
                <AdminHeader title="Classroom Create" breadCrumbs="Classroom Create" goBack={true} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Create classroom?" yesText="Yes" noText="No" onYes={e => {this.createClassroom(); this.closeModal(); this.confirmBackendTransaction();}}/>
                <div className="Classroom-Create-Container-Admin">
                    <AdminPopout hist={this.props.history}/>
                    <div className="Classroom-Create-Wrapper-Admin">
                        <ConfirmToast text="Classroom created!"/>
                        <div className="Classroom-Create-Form-Wrapper-Admin">
                            <div className="Classroom-Create-Title-Wrapper-Admin">
                                <label className="Classroom-Create-Title-Label-Admin">Classroom Title: </label> <input className="Classroom-Create-Title-Input-Admin" id="Classroom-Create-Title-Input-Admin" placeholder="Title..." maxLength="50"/>
                            </div>
                            <div className="Classroom-Create-Button-Area-Admin"> 
                                <button className="Classroom-Create-Save-Button-Admin" onClick={(e) => this.showModal(e)}>Create</button>
                                <button className="Classroom-Create-Cancel-Button-Admin" onClick={e => this.cancelCreate()}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default ClassroomCreateAdmin;


//"react-router-dom": "^6.0.0-alpha.1",
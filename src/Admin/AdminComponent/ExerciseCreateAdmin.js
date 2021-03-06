import React, { Fragment } from 'react';
import './ExerciseCreateAdmin.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout';
import ConfirmModal from '../../Confirm/ConfirmModal';
import ConfirmToast from '../../Confirm/ConfirmToast';
import { Link } from 'react-router-dom';
import {RedirectService} from '../../_services/RedirectService';
import Component from '../../Component/Component';
import {DataCheckService} from '../../_services/DataCheckService';
import {baseURI} from '../../_services/APIService';
import {authService} from '../../_services/AuthenticationService';

class ExerciseCreateAdmin extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                canGoBack: true,
                selectedFile: "",
                classroom: props.location.state.classroom
            }
        }else{
            //error toast here
        }

    }
    
    componentDidMount(){ 
        authService.checkTokenValidity(this.props.history);
    }

    componentWillUnmount(){
        
    }

    async createExercise(event){

        var aTitle = document.getElementById("Exercise-Create-Title-Input-Admin").value;
        const fileData = new FormData();

        //var componentID = this.state.component.component_id;
        var classroomID = this.state.classroom.classroom_id;
        var exerciseBlobID = -1;
        var classCompID;
        var exerciseID;

        if(DataCheckService.validateFields([aTitle])){

            await fetch(baseURI + "/api/exercise", {  
                method: "POST",                          
                headers: {"Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("auth_token")},
                body: JSON.stringify({title: aTitle.trim(), activated: "A",  classroom: {classroom_id: classroomID}}) //Need to add in other fields here, back end and front end
            }).then(res => res.json())
            .then(
                (text) => {
                    exerciseID = text;
                }
            ).catch(console.log);

            fileData.append("files", this.state.selectedFile);

            await fetch(baseURI + "/api/exercise_blob/" + exerciseID + "/" + classroomID + "/" + exerciseBlobID , { 
                method: "POST",                          
                body: fileData,
                headers: {"Authorization": "Bearer " + localStorage.getItem("auth_token")}
            }).catch(console.log);


            document.getElementById("Exercise-Create-Title-Input-Admin").value = "";
            document.getElementById("Exercise-Create-Image-Label").innerHTML = "Select an Image";

            this.confirmBackendTransaction();

        }else{
            this.showError();
        }

    }

    handleFileUpload(event){
        var _URL = window.URL || window.webkitURL;

        var idNum = event.target.id.split("-")[2];

        var file = event.target.files[0];

        var img = new Image();
        var imgwidth = 0;
        var imgheight = 0;

        if(!(file == undefined)){

            img.src = _URL.createObjectURL(file);

            img.onload = function(){
                imgwidth = this.width;
                imgheight = this.height;

                if(true){ //if there are image dimension contraints place those here
                    document.getElementById("Exercise-Create-Image-Label").innerHTML = file.name;
                }else{
                    alert("Image dimensions are invalid. The image must be 950(width)x750(height).");
                }
            }

            this.setState({
                selectedFile: file
            });
    
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
        confirmation.innerText = "Exercise must have a title!";
        confirmation.className = "show";
        setTimeout(function(){ confirmation.className = confirmation.className.replace("show", ""); }, 3000);
    }

    confirmBackendTransaction(){
        // Get the snackbar confirmation
        var confirmation = document.getElementById("snackbar");
        confirmation.innerText = "Exercise created!";
        confirmation.className = "show";
        setTimeout(function(){ confirmation.className = confirmation.className.replace("show", ""); }, 3000);
    }

    cancelCreate(){
        this.props.history.push({pathname: "componentAdmin", state: {goBack: true, classroom: this.state.classroom, component: this.state.component}});
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

        var classroom = this.props.location.state.classroom.title;
        //var component = this.props.location.state.component.title;

        return(
            <Fragment>
                <AdminHeader title={"Exercise Create"} breadCrumbs={"Create Exercise for " + classroom} goBack={true} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Create exercise?" yesText="Yes" noText="No" onYes={e => {this.createExercise(); this.closeModal();}}/>
                <div className="Exercise-Create-Container-Admin">
                    <AdminPopout hist={this.props.history}/>
                    <div className="Exercise-Create-Wrapper-Admin">
                        <ConfirmToast text="Exercise created!"/>
                        <div className="Exercise-Create-Form-Wrapper-Admin">
                            <div className="Exercise-Create-Title-Wrapper-Admin">
                                <label className="Exercise-Create-Title-Label-Admin">Exercise Title: </label> <input className="Exercise-Create-Title-Input-Admin" id="Exercise-Create-Title-Input-Admin" placeholder="Title..." maxLength="30"/>
                            </div>
                            <div className="Exercise-Create-Image-Area">
                                <label className="Exercise-Create-Image-Label" id="Exercise-Create-Image-Label" for="Exercise-Create-Image-Input">Select an Image</label><input className="Exercise-Create-Image-Input" id="Exercise-Create-Image-Input" type="file"  onChange={(e) => this.handleFileUpload(e)} maxLength="50"/>
                            </div>
                            <div className="Exercise-Create-Button-Area-Admin"> 
                                <button className="Exercise-Create-Save-Button-Admin" onClick={(e) => this.showModal(e)}>Create</button>
                                <button className="Exercise-Create-Cancel-Button-Admin" onClick={e => {this.cancelCreate()}}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default ExerciseCreateAdmin;


//"react-router-dom": "^6.0.0-alpha.1",
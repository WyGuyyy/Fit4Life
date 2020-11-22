import React, { Fragment } from 'react';
import './ExerciseEditAdmin.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout';
import ConfirmModal from '../../Confirm/ConfirmModal';
import ConfirmToast from '../../Confirm/ConfirmToast';
import { Link } from 'react-router-dom';
import {RedirectService} from '../../_services/RedirectService';
import {DataCheckService} from '../../_services/DataCheckService';

class ExerciseEditAdmin extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                canGoBack: true,
                selectedFile: "",
                title: props.location.state.title,
                exercise: props.location.state.exercise,
                classroom: props.location.state.classroom,
                component: props.location.state.component,
                exerciseObject: ""
            }

            this.getExercise();
        }

    }
    
    componentDidMount(){ 
        
    }

    componentWillUnmount(){
        
    }

    async getExercise(){

        var exercise;

        await fetch("http://localhost:8080/api/exercise/" + this.props.location.state.exercise.exercise_id, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                exercise = result;
            }
        ).catch(console.log);


        this.setState({
            exerciseObject: exercise
        });

    }

    async saveExercise(event){

        var aTitle = document.getElementById("Exercise-Edit-Title-Input-Admin").value;
        const fileData = new FormData();

        var componentID = this.state.component.component_id;
        var exerciseID = this.state.exercise.exercise_id;

        if(DataCheckService.validateFields([aTitle])){

            await fetch("http://localhost:8080/api/exercise", {  
                method: "PUT",                          
                headers: {"Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("auth_token")},
                body: JSON.stringify({exercise_id: exerciseID, title: aTitle, component: {component_id: componentID}}) //Need to add in other fields here, back end and front end
            }).then(res => res.json())
            .then(
                (text) => {
                    exerciseID = text;
                }
            ).catch(console.log);

            fileData.append("files", this.state.selectedFile);

            //Would instead need to update the picture here instead of creating a new one
            //Possible that exercise ID is also unique? (Use as primary key for Blob?)
            //Start with these next time -> and consider how class_comp_ex will be solved/used
            await fetch("http://localhost:8080/api/exercise_blob/" + exerciseID + "/" + componentID , { 
                method: "POST",                          
                body: fileData,
                headers: {"Authorization": "Bearer " + localStorage.getItem("auth_token")}
            }).catch(console.log);

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

                if(true){ //if there are image dimension contraints, place those here
                    document.getElementById("Exercise-Edit-Image-Label").innerHTML = file.name;
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
        confirmation.innerText = "Exercise saved!";
        confirmation.className = "show";
        setTimeout(function(){ confirmation.className = confirmation.className.replace("show", ""); }, 3000);
    }

    cancelSave(){
        this.props.history.push({pathname: "componentAdmin", state: {goBack: true, classroom: this.state.classroom, component: this.state.component}});
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
        var component = this.props.location.state.component.title;
        var exercise = this.state.exerciseObject;

        return(
            <Fragment>
                <AdminHeader title={"Exercise Edit"} breadCrumbs={"Edit Exercise for " + classroom + ">" + component} goBack={true} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Save exercise?" yesText="Yes" noText="No" onYes={e => {this.saveExercise(); this.closeModal();}}/>
                <div className="Exercise-Edit-Container-Admin">
                    <AdminPopout hist={this.props.history}/>
                    <div className="Exercise-Edit-Wrapper-Admin">
                        <ConfirmToast text="Exercise saved!"/>
                        <div className="Exercise-Edit-Form-Wrapper-Admin">
                            <div className="Exercise-Edit-Title-Wrapper-Admin">
                                <label className="Exercise-Edit-Title-Label-Admin">Exercise Title: </label> <input className="Exercise-Edit-Title-Input-Admin" id="Exercise-Edit-Title-Input-Admin" defaultValue={exercise.title} maxLength="50"/>
                            </div>
                            <div className="Exercise-Edit-Image-Area">
                                <label className="Exercise-Edit-Image-Label" id="Exercise-Edit-Image-Label" for="Exercise-Edit-Image-Input">Select an Image</label><input className="Exercise-Edit-Image-Input" id="Exercise-Edit-Image-Input" type="file" onChange={(e) => this.handleFileUpload(e)} />
                            </div>
                            <div className="Exercise-Edit-ViewImage-Area">
                                <button className="Exercise-Edit-ViewImage-Button-Admin"><i className="fa fa-eye"></i></button>
                            </div>
                            <div className="Exercise-Edit-Button-Area-Admin"> 
                                <button className="Exercise-Edit-Save-Button-Admin" onClick={(e) => this.showModal(e)}>Save</button>
                                <button className="Exercise-Edit-Cancel-Button-Admin" onClick={e => this.cancelSave()}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default ExerciseEditAdmin;


//"react-router-dom": "^6.0.0-alpha.1",
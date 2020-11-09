import React, { Fragment } from 'react';
import './ExerciseEditAdmin.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout';
import ConfirmModal from '../../Confirm/ConfirmModal';
import ConfirmToast from '../../Confirm/ConfirmToast';
import { Link } from 'react-router-dom';

class ExerciseEditAdmin extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            canGoBack: true,
            selectedFile: "",
            title: props.location.state.title,
            exercise: props.location.state.exercise,
            classroom: props.location.state.classroom,
            component: props.location.state.component
        }

    }
    
    componentDidMount(){ 
        
    }

    componentWillUnmount(){
        
    }

    async saveExercise(event){

        var aTitle = document.getElementById("Exercise-Edit-Title-Input-Admin").value;
        const fileData = new FormData();

        var componentID = this.state.component.component_id;
        var exerciseID = this.state.exercise.exercise_id;

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
            body: fileData
        }).catch(console.log);

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

    confirmBackendTransaction(){
        // Get the snackbar confirmation
        var confirmation = document.getElementById("snackbar");
        confirmation.className = "show";
        setTimeout(function(){ confirmation.className = confirmation.className.replace("show", ""); }, 3000);
    }

    cancelSave(){
        this.props.history.push({pathname: "componentAdmin", state: {goBack: true}});
    }
    
    goBack(){ //This isnt working, start here next time
        console.log(this.props);
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }
    
    render(){

        var classroom = this.props.location.state.classroom.title;
        var component = this.props.location.state.component.title;

        return(
            <Fragment>
                <AdminHeader title={"Exercise Edit"} breadCrumbs={"Edit Exercise for " + classroom + ">" + component} goBack={true} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Save exercise?" yesText="Yes" noText="No" onYes={e => {this.saveExercise(); this.closeModal(); this.confirmBackendTransaction();}}/>
                <div className="Exercise-Edit-Container-Admin">
                    <AdminPopout />
                    <div className="Exercise-Edit-Wrapper-Admin">
                        <ConfirmToast text="Exercise saved!"/>
                        <div className="Exercise-Edit-Form-Wrapper-Admin">
                            <div className="Exercise-Edit-Title-Wrapper-Admin">
                                <label className="Exercise-Edit-Title-Label-Admin">Exercise Title: </label> <input className="Exercise-Edit-Title-Input-Admin" id="Exercise-Edit-Title-Input-Admin" defaultValue={this.props.location.state.title}/>
                            </div>
                            <div className="Exercise-Edit-Image-Area">
                                <label className="Exercise-Edit-Image-Label" id="Exercise-Edit-Image-Label" for="Exercise-Edit-Image-Input">Select an Image</label><input className="Exercise-Edit-Image-Input" id="Exercise-Edit-Image-Input" type="file" onChange={(e) => this.handleFileUpload(e)}/>
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
import React, { Fragment } from 'react';
import './ExerciseCreateAdmin.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout';
import ConfirmModal from '../../Confirm/ConfirmModal';
import ConfirmToast from '../../Confirm/ConfirmToast';
import { Link } from 'react-router-dom';

class ExerciseCreateAdmin extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            canGoBack: true,
            selectedFile: "",
            classroom: props.location.state.classroom,
            component: props.location.state.component
        }

    }
    
    componentDidMount(){ 
        
    }

    componentWillUnmount(){
        
    }

    async createExercise(event){

        var aTitle = document.getElementById("Exercise-Create-Title-Input-Admin").value;
        const fileData = new FormData();

        var exerciseID;

        await fetch("http://localhost:8080/api/exercise", {  
            method: "POST",                          
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title: aTitle}) //Need to add in other fields here, back end and front end
        }).then(res => res.json())
        .then(
            (text) => {
                exerciseID = text;
            }
        ).catch(console.log);

        fileData.append("files", this.state.selectedFile);

        await fetch("http://localhost:8080/api/exercise_blob/" + exerciseID , { 
            method: "POST",                          
            body: fileData
        }).catch(console.log);

        document.getElementById("Exercise-Create-Title-Input-Admin").value = "";
        document.getElementById("Exercise-Create-Image-Label").innerHTML = "Select an Image";

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

    confirmBackendTransaction(){
        // Get the snackbar confirmation
        var confirmation = document.getElementById("snackbar");
        confirmation.className = "show";
        setTimeout(function(){ confirmation.className = confirmation.className.replace("show", ""); }, 3000);
    }

    cancelCreate(){
        this.props.history.push({pathname: "componentAdmin", state: {goBack: true}});
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
                <AdminHeader title={this.props.location.state.classroom.title + " " + this.props.location.state.component.title + " Exercise Create"} goBack={true} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Create exercise?" yesText="Yes" noText="No" onYes={e => {this.createExercise(); this.closeModal(); this.confirmBackendTransaction();}}/>
                <div className="Exercise-Create-Container-Admin">
                    <AdminPopout />
                    <div className="Exercise-Create-Wrapper-Admin">
                        <ConfirmToast text="Exercise created!"/>
                        <div className="Exercise-Create-Form-Wrapper-Admin">
                            <div className="Exercise-Create-Title-Wrapper-Admin">
                                <label className="Exercise-Create-Title-Label-Admin">Exercise Title: </label> <input className="Exercise-Create-Title-Input-Admin" id="Exercise-Create-Title-Input-Admin" placeholder="Title..."/>
                            </div>
                            <div className="Exercise-Create-Image-Area">
                                <label className="Exercise-Create-Image-Label" id="Exercise-Create-Image-Label" for="Exercise-Create-Image-Input">Select an Image</label><input className="Exercise-Create-Image-Input" id="Exercise-Create-Image-Input" type="file"  onChange={(e) => this.handleFileUpload(e)}/>
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
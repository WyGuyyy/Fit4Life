import React, { Fragment } from 'react';
import './ExerciseEditAdmin.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout'
import { Link } from 'react-router-dom';

class ExerciseEditAdmin extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            canGoBack: true,
            selectedFile: "",
            title: props.location.state.title,
            exercise: props.location.state.exercise
        }

    }
    
    componentDidMount(){ 
        
    }

    componentWillUnmount(){
        
    }

    async saveExercise(event){

        var aTitle = document.getElementById("Exercise-Edit-Title-Input-Admin").value;
        const fileData = new FormData();

        var exerciseID;

        await fetch("http://localhost:8080/api/exercise", {  
            method: "PUT",                          
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({exercise_id: this.state.exercise.exercise_id, title: aTitle}) //Need to add in other fields here, back end and front end
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
        await fetch("http://localhost:8080/api/exercise_blob/" + exerciseID , { 
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
    
    goBack(){ //This isnt working, start here next time
        console.log(this.props);
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }
    
    render(){

        return(
            <Fragment>
                <AdminHeader title="Admin Exercise Edit" goBack={true} customClick={this.goBack.bind(this)}/>
                <div className="Exercise-Edit-Container-Admin">
                    <AdminPopout />
                    <div className="Exercise-Edit-Wrapper-Admin">
                        <div className="Exercise-Edit-Form-Wrapper-Admin">
                            <div className="Exercise-Edit-Title-Wrapper-Admin">
                                <label className="Exercise-Edit-Title-Label-Admin">Exercise Title: </label> <input className="Exercise-Edit-Title-Input-Admin" id="Exercise-Edit-Title-Input-Admin" defaultValue={this.props.location.state.title}/>
                            </div>
                            <div className="Exercise-Edit-Image-Area">
                                <label className="Exercise-Edit-Image-Label" id="Exercise-Edit-Image-Label" for="Exercise-Edit-Image-Input">Select an Image</label><input className="Exercise-Edit-Image-Input" id="Exercise-Edit-Image-Input" type="file" onChange={(e) => this.handleFileUpload(e)}/>
                            </div>
                            <div className="Exercise-Edit-Button-Area-Admin"> 
                                <button className="Exercise-Edit-Save-Button-Admin" onClick={(e) => this.saveExercise(e)}>Save</button>
                                <button className="Exercise-Edit-Cancel-Button-Admin">Cancel</button>
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
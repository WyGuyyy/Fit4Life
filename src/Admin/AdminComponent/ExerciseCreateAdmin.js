import React, { Fragment } from 'react';
import './ExerciseCreateAdmin.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout'
import { Link } from 'react-router-dom';

class ExerciseCreateAdmin extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            canGoBack: true,
            selectedFile: ""
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
    
    goBack(){ //This isnt working, start here next time
        console.log(this.props);
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }
    
    render(){

        return(
            <Fragment>
                <AdminHeader title="Admin Exercise Create" goBack={true} customClick={this.goBack.bind(this)}/>
                <div className="Exercise-Create-Container-Admin">
                    <AdminPopout />
                    <div className="Exercise-Create-Wrapper-Admin">
                        <div className="Exercise-Create-Form-Wrapper-Admin">
                            <div className="Exercise-Create-Title-Wrapper-Admin">
                                <label className="Exercise-Create-Title-Label-Admin">Exercise Title: </label> <input className="Exercise-Create-Title-Input-Admin" id="Exercise-Create-Title-Input-Admin" placeholder="Title..."/>
                            </div>
                            <div className="Exercise-Create-Image-Area">
                                <label className="Exercise-Create-Image-Label" id="Exercise-Create-Image-Label" for="Exercise-Create-Image-Input">Select an Image</label><input className="Exercise-Create-Image-Input" id="Exercise-Create-Image-Input" type="file"  onChange={(e) => this.handleFileUpload(e)}/>
                            </div>
                            <div className="Exercise-Create-Button-Area-Admin"> 
                                <button className="Exercise-Create-Save-Button-Admin" onClick={(e) => this.createExercise(e)}>Create</button>
                                <button className="Exercise-Create-Cancel-Button-Admin">Cancel</button>
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
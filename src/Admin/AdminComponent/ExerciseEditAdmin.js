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
            title: props.location.state.title
        }

    }
    
    componentDidMount(){ 
        
    }

    componentWillUnmount(){
        
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
                                <label className="Exercise-Edit-Title-Label-Admin">Exercise Title: </label> <input className="Exercise-Edit-Title-Input-Admin" defaultValue={this.props.location.state.title}/>
                            </div>
                            <div className="Exercise-Edit-Image-Area">
                                <label className="Exercise-Edit-Image-Label" id="Exercise-Edit-Image-Label" for="Exercise-Edit-Image-Input">Select an Image</label><input className="Exercise-Edit-Image-Input" id="Exercise-Edit-Image-Input" type="file" onChange={(e) => this.handleFileUpload(e)}/>
                            </div>
                            <div className="Exercise-Edit-Button-Area-Admin"> 
                                <button className="Exercise-Edit-Save-Button-Admin">Save</button>
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
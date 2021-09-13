import React from 'react';
import './ExerciseTileCopy.css';
import { Link } from 'react-router-dom';
import lhs_logo from '../../Assets/lhs_logo.png';

class ExerciseTileCopy extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            exercise: props.exercise,
            image: props.image
        };

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
    
    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    //Render the Header component to the DOM/Screen
    render(){

        var aSrc;

        if(this.props.image === undefined || this.props.image === null){
            aSrc = lhs_logo;
        }else{
            aSrc = "data:" + this.props.image.content_type + ";base64," + this.props.image.blob_data;
        }

        var isSelected = this.props.selected;

        return(
            <div className="Exercise-TileCopy-Container" onClick={this.props.tileClickEvent}>
                <div className={isSelected ? "Exercise-TileCopy-Selected-Wrapper" : "Exercise-TileCopy-Wrapper"}>
                    <div className="Exercise-TileCopy-Image-Wrapper">
                        <img className="Exercise-TileCopy-Image" src={aSrc} />
                    </div>
                    <div className="Exercise-TileCopy-Title-Wrapper">
                        <h2 className="Exercise-TileCopy-Title">{this.state.exercise}</h2>
                    </div>
                </div>
            </div>
        );
            
    }s
}

export default ExerciseTileCopy;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
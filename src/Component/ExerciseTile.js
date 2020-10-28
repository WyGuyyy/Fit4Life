import React from 'react';
import './ExerciseTile.css';
import { Link } from 'react-router-dom';
import lhs_logo from '../Assets/lhs_logo.png';

class ExerciseTile extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            exercise: props.exercise,
            image: props.image
        };

        console.log(props.image);

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
    
    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    /*goToExercise(){

        console.log(this);

        this.props.history.push({
            pathname: "/exercise",
            state: {exercise: this.state.exercise}
        });
    }*/

    //Render the Header component to the DOM/Screen
    render(){

        var aSrc;

        //console.log(this.props.image);
        if(this.props.image === undefined){
            aSrc = "";
        }else{
            aSrc = this.props.image.blob_data;
        }

        return(
            <div className="Exercise-Tile-Container" onClick={this.props.tileClickEvent}>
                <div className="Exercise-Tile-Wrapper">
                    <img className="Exercise-Tile-Image" src={(aSrc.localeCompare("") === 0 ? null : this.props.image.blob_data)} width="300" height="300"/>
                    <h2 className="Exercise-Tile-Title">{this.state.exercise}</h2>
                </div>
            </div>
        );
            
    }s
}

export default ExerciseTile;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
import React from 'react';
import ReactDOM from "react-dom"
import './LoadingSpinner.css';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

const SPINNER_DISPLAY_FLEX = "flex";
const SPINNER_DISPLAY_NONE = "none";

class LoadingSpinner extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isLoading: props.isLoading
        };

    }
    
    componentDidMount(){ 

    }

    //Lifecycle event preparing Slideshow component to unmount from DOM
    componentWillUnmount(){
        
    }


    render(){

        return(
            <div className="loaderBackground" style={{display: (this.props.isLoading ? SPINNER_DISPLAY_FLEX : SPINNER_DISPLAY_NONE)}}>
                <div className="loader">
                    
                </div>
            </div>
        );
            
    }
}

export default LoadingSpinner;


//"react-router-dom": "^6.0.0-alpha.1",
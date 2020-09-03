import React from 'react';
import './MMS_Title.css';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

class MMS_Title extends React.Component{
    constructor(props){
        super(props);

    }
    
    //Lifecycle method for after MMS_Title component has mounted to the DOM
    componentDidMount(){ 
    
    }

    //Lifecycle event preparing MMS_Title component to unmount from DOM
    componentWillUnmount(){
        
    }

    //render the MMS_Title component to the DOM/screen
    render(){

        return(
            <div className="MMS-Title-Wrapper" onClick={this.props.titleClickEvent}>
                <h1 className="MMS-Title">Fit<span style={{color: "#6b4e00"}}>4</span>Life</h1>
            </div>
        );
            
    }
}

export default MMS_Title;


//"react-router-dom": "^6.0.0-alpha.1",
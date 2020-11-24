import React from 'react';
import './ConfirmToast.css';
import { Link } from 'react-router-dom';
import lhs_logo from '../Assets/lhs_logo.png';

class ConfirmToast extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            text: props.text,
        };

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
        
    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    hideModal(event){
        document.getElementById("modalContainer").style.display = "none";
    }

    //Render the Header component to the DOM/Screen
    render(){

        return(

            <div id="snackbar">{this.props.text}</div>
            
        );
            
    }
}

export default ConfirmToast;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
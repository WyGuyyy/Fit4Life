import React from 'react';
import './ConfirmCreate.css';
import { Link } from 'react-router-dom';
import lhs_logo from '../Assets/lhs_logo.png';

class ConfirmCreate extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            text: props.text,
            buttonConfirmText: props.confirmText,
            id: props.id
        };

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
    
    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    hideModal(event){
        document.getElementById((this.state.id === undefined ? "modalContainer" : this.state.id)).style.display = "none";
    }

    //Render the Header component to the DOM/Screen
    render(){

        return(
            <div className="confirmCreateContainer" id="confirmCreateContainer" onClick={this.props.tileClickEvent}>
                <div className="confirmCreateContent">
                    <p className="confirmCreateText" id="confirmCreateText">{this.props.text}</p>
                    <div className="ConfirmCreate-Button-Wrapper">
                        <button className="confirmCreateConfirmText" onClick={this.props.confirm}>{this.props.btnText}</button>
                    </div>
                </div>
            </div>
        );
            
    }s
}

export default ConfirmCreate;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
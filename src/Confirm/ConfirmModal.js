import React from 'react';
import './ConfirmModal.css';
import { Link } from 'react-router-dom';
import lhs_logo from '../Assets/lhs_logo.png';

class ConfirmModal extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            text: props.text,
            buttonYesText: props.yesText,
            buttonNoText: props.noText,
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

    /*goToExercise(){

        this.props.history.push({
            pathname: "/exercise",
            state: {exercise: this.state.exercise}
        });
    }*/

    //Render the Header component to the DOM/Screen
    render(){

        return(
            <div className="modalContainer" id={(this.props.id === undefined ? "modalContainer" : this.props.id)} onClick={this.props.tileClickEvent}>
                <div className="modalContent">
                    <p className="modalText" id="modalText">{this.props.text}</p>
                    <div className="Modal-Button-Wrapper">
                        <button className="modalYesText" onClick={this.props.onYes}>{this.props.yesText}</button>
                        <button className="modalNoText" onClick={e => this.hideModal(e)}>{this.props.noText}</button>
                    </div>
                </div>
            </div>
        );
            
    }s
}

export default ConfirmModal;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './PersonalInfoEdit.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout'
import { Link } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';

class PersonalInfoEdit extends React.Component{
    constructor(props){
        super(props);

        this.state = {
           canGoBack: props.location.state.goBack
        };

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
        
    }

    componentDidUpdate(){

    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    

    goBack(){ //This isnt working, start here next time
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }

    //Render the Header component to the DOM/Screen
    render(){

        return(
            <Fragment>
                <Header title="Edit Personal Info" goBack={true} customClick={this.goBack.bind(this)}/>
                <div className="Personal-Info-Edit-Container">
                    <Popout />
                    <div className="Personal-Info-Edit-Wrapper" id="Personal-Info-Edit-Wrapper">
                        <div className="Personal-Info-Edit-Form-Wrapper">

                            <div className="Personal-Info-Edit-Title-Wrapper">
                                <h2 className="Personal-Info-Edit-Form-Title">My Information</h2>
                            </div>

                            <div className="Personal-Info-Edit-First-Name-Wrapper">
                                <label className="Personal-Info-Edit-First-Name-Label">First Name: </label> <input className="Personal-Info-Edit-First-Name-Input" type="text"/>
                            </div>

                            <div className="Personal-Info-Edit-Last-Name-Wrapper">
                                <label className="Personal-Info-Edit-Last-Name-Label">Last Name: </label> <input className="Personal-Info-Edit-Last-Name-Input" type="text"/>
                            </div>

                            <div className="Personal-Info-Edit-Email-Wrapper">
                                <label className="Personal-Info-Edit-Email-Label">Email: </label> <input className="Personal-Info-Edit-Email-Input" type="text"/>
                            </div>

                            <div className="Personal-Info-Edit-Weight-Wrapper">
                                <label className="Personal-Info-Edit-Weight-Label">Weight: </label> <input className="Personal-Info-Edit-Weight-Input" type="text"/>
                            </div>

                            <div className="Personal-Info-Edit-Height-Wrapper">
                                <label className="Personal-Info-Edit-Height-Label">Height: </label> <div className="Personal-Info-Edit-Height-Input-Wrapper"> <input className="Personal-Info-Edit-Height-Feet-Input" type="text"/> <input className="Personal-Info-Edit-Height-Inches-Input" type="text"/> </div>
                            </div>

                            <div className="Personal-Info-Edit-Submit-Wrapper">
                                 <button className="Personal-Info-Edit-Cancel-Button">Cancel</button> <button className="Personal-Info-Edit-Save-Button">Save</button>
                            </div>

                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default PersonalInfoEdit;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
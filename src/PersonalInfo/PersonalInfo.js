import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './PersonalInfo.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout'
import { Link } from 'react-router-dom';
import { AiFillBell, AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

class PersonalInfo extends React.Component{
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
                <Header title="Personal Info" goBack={true} customClick={this.goBack.bind(this)}/>
                <div className="Personal-Info-Container">
                    <Popout />
                    <div className="Personal-Info-Wrapper" id="Personal-Info-Wrapper">
                        <div className="Personal-Info-Form-Wrapper">

                            <div className="Personal-Info-First-Name-Wrapper">
                                <label className="Personal-Info-First-Name-Label">First Name: </label> <input className="Personal-Info-First-Name-Input" type="text"/>
                            </div>

                            <div className="Personal-Info-Last-Name-Wrapper">
                                <label className="Personal-Info-Last-Name-Label">Last Name: </label> <input className="Personal-Info-Last-Name-Input" type="text"/>
                            </div>

                            <div className="Personal-Info-Email-Wrapper">
                                <label className="Personal-Info-Email-Label">Email: </label> <input className="Personal-Info-Email-Input" type="text"/>
                            </div>

                            <div className="Personal-Info-Weight-Wrapper">
                                <label className="Personal-Info-Weight-Label">Weight: </label> <input className="Personal-Info-Weight-Input" type="text"/>
                            </div>

                            <div className="Personal-Info-Height-Wrapper">
                                <label className="Personal-Info-Height-Label">Height: </label> <input className="Personal-Info-Height-Feet-Input" type="text"/> <input className="Personal-Info-Height-Inches-Input" type="text"/>
                            </div>

                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default PersonalInfo;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
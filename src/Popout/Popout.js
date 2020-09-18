import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './Popout.css';
import Header from '../Header/Header';
import { Link } from 'react-router-dom';

class Popout extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            
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

    //Render the Header component to the DOM/Screen
    render(){

        return(

            <div className="popoutContainer">
                <div className="popoutWrapper">
                    <button className="popoutButton">Goals</button>
                    <button className="popoutButton">Schedule</button>
                    <button className="popoutButton">Personal Info</button>
                    <button className="popoutButton">Invites</button>
                </div>
            </div>
        );
            
    }
}

export default Popout;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
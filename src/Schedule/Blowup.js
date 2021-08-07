import React, { Fragment } from 'react';
import {baseURI} from '../_services/APIService';
import {getStudentGradesForWeek} from '../_services/GradeService';
import ReactDom from 'react-dom';
import './Blowup.css';

class Blowup extends React.Component{
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

                    <div className="Blowup-Wrapper">
                        <div className="Blowup-Exit"></div>
                        <div className="Blowup-List"></div>
                    </div>

            );
            
    }

}

export default Blowup;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
/*<div className="Goal-Detail-Title-Wrapper">
                            <label className="Goal-Detail-Title-Label">Goal Title: </label> <input className="Goal-Detail-Title-Input" type="text"/>
                        </div>
                        <div className="Goal-Detail-Progress-Wrapper">
                            <label className="Goal-Detail-Progress-Label">Goal Progress: </label> <input className="Goal-Detail-Progress-Input" type="text"/>
                        </div>
                        <div className="Goal-Detail-Description-Wrapper">
                            <label className="Goal-Detail-Description-Label">Goal Detail: </label> <input className="Goal-Detail-Description-Input" type="text"/>
                        </div>*/
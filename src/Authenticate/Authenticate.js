import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './Authenticate.css';
import { Link } from 'react-router-dom';

class Authenticate extends React.Component{
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

            <div className="authenticateContainer">
                <div className="authenticateWrapper">
                    <form className="authenticateForm">
                        <div className="Authenticate-Row-Container">
                            <div className="Authneticate-Fit4Life-Row">
                                <h1 className="topTitle">Fit<span style={{color: "#6b4e00"}}>4</span>Life</h1>
                            </div>
                            <div className="Authneticate-Title-Row">
                                <h2 className="authenticateTitle">LOGIN</h2>
                            </div>
                            <div className="Authneticate-Username-Row">
                                <label className="authenticateLabel">Username: </label> <input className="authenticateInput"/>
                            </div>
                            <div className="Authneticate-Password-Row">
                                <label className="authenticateLabel">Password: </label> <input className="authenticateInput"/>
                            </div>
                            <div className="Authneticate-Login-Row">
                                <button className="authenticateLogin">Login</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
            
    }
}

export default Authenticate;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
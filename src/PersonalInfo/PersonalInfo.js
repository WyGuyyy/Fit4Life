import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './PersonalInfo.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout'
import { Link } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';

class PersonalInfo extends React.Component{
    constructor(props){
        super(props);

        this.state = {
           canGoBack: props.location.state.goBack,
           personalInfoObject: ""
        };

        this.getPersonalInfo();

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
        
    }

    componentDidUpdate(){

    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    async getPersonalInfo(){

        var personalInfo;

        await fetch("http://localhost:8080/api/user/1", {  
            method: "GET",                          
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                personalInfo = result;
            }
        ).catch(console.log);

            this.setState({
                personalInfoObject: personalInfo
            });

    }

    goToPersonalInfoEdit(e){
        this.props.history.push({
            pathname: "/personalEdit",
            state: {goBack: true, personalInfo: this.state.personalInfoObject}
        });
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

                            <div className="Personal-Info-Title-Wrapper">
                                <h2 className="Personal-Info-Form-Title">My Information</h2>
                            </div>

                            <div className="Personal-Info-First-Name-Wrapper">
                                <label className="Personal-Info-First-Name-Label">First Name: </label> <h2 className="Personal-Info-First-Name">{this.state.personalInfoObject.first_name}</h2>
                            </div>

                            <div className="Personal-Info-Last-Name-Wrapper">
                                <label className="Personal-Info-Last-Name-Label">Last Name: </label> <h2 className="Personal-Info-Last-Name">{this.state.personalInfoObject.last_name}</h2>
                            </div>

                            <div className="Personal-Info-Email-Wrapper">
                                <label className="Personal-Info-Email-Label">Email: </label> <h2 className="Personal-Info-Email">{this.state.personalInfoObject.email}</h2>
                            </div>

                            <div className="Personal-Info-Weight-Wrapper">
                                <label className="Personal-Info-Weight-Label">Weight: </label> <h2 className="Personal-Info-Weight">{this.state.personalInfoObject.weight}</h2>
                            </div>

                            <div className="Personal-Info-Height-Wrapper">
                                <label className="Personal-Info-Height-Label">Height: </label> <h2 className="Personal-Info-Height">{this.state.personalInfoObject.height_feet} {this.state.personalInfoObject.height_inches}</h2>
                            </div>

                            <div className="Personal-Info-Edit-Button-Wrapper">
                                 <button className="Personal-Info-Edit-Button" onClick={(e) => this.goToPersonalInfoEdit(e)}>Edit</button>
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
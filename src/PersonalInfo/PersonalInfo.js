import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './PersonalInfo.css';
import Header from '../Header/Header';
import AdminHeader from '../Admin/AdminHeader/AdminHeader';
import AdminPopout from '../Admin/AdminPopout/AdminPopout';
import Popout from '../Popout/Popout'
import { Link } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import {RedirectService} from '../_services/RedirectService';
import {baseURI} from '../_services/APIService';
import {authService} from '../_services/AuthenticationService';

class PersonalInfo extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                canGoBack: props.location.state.goBack,
                personalInfoObject: ""
            };
            
            this.getPersonalInfo();
        }

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
        authService.checkTokenValidity(this.props.history);
    }

    componentDidUpdate(){

    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    async getPersonalInfo(){

        var personalInfo;

        await fetch(baseURI + "/api/user/" + localStorage.getItem("userID"), {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
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

        if(!RedirectService.checkItemForUndefined(this.props.location.state)){
            return RedirectService.decideRedirect();
        }

        return(
            <Fragment>
                {localStorage.getItem("userRole").localeCompare("STUDENT") === 0 ? 
                <Header title="Personal Info" breadCrumbs="Personal Info" goBack={true} customClick={this.goBack.bind(this)}/> : 
                <AdminHeader title={"Personal Info"} breadCrumbs="Personal Info" goBack={false} customClick={this.goBack.bind(this)}/>}
                <div className="Personal-Info-Container">
                    {localStorage.getItem("userRole").localeCompare("STUDENT") === 0 ? 
                     <Popout hist={this.props.history}/> : 
                     <AdminPopout hist={this.props.history}/>}
                    <div className="Personal-Info-Wrapper" id="Personal-Info-Wrapper">
                        <div className="Personal-Info-Form-Wrapper">
                            <div className="Personal-Info-Title-Wrapper">
                                <h2 className="Personal-Info-Form-Title">My Information</h2>
                            </div>

                            <div className="Personal-Info-Field-Wrapper-Parent">
                                <div className="Personal-Info-Field-Wrapper">
                                    <h2 className="Personal-Info-Field">{"FIRST NAME: " + this.state.personalInfoObject.first_name}</h2>
                                </div>
                            </div>

                            <div className="Personal-Info-Field-Wrapper-Parent">
                                <div className="Personal-Info-Field-Wrapper">
                                    <h2 className="Personal-Info-Field">{"LAST NAME: " + this.state.personalInfoObject.last_name}</h2>
                                </div>
                            </div>

                            <div className="Personal-Info-Field-Wrapper-Parent">
                                <div className="Personal-Info-Field-Wrapper">
                                    <h2 className="Personal-Info-Field">{"DISPLAY NAME: " + this.state.personalInfoObject.display_name}</h2>
                                </div>
                            </div>

                            <div className="Personal-Info-Field-Wrapper-Parent">
                                <div className="Personal-Info-Field-Wrapper">
                                    <h2 className="Personal-Info-Field">{"EMAIL: " + this.state.personalInfoObject.email}</h2>
                                </div>
                            </div>

                            <div className="Personal-Info-Field-Wrapper-Parent">
                                <div className="Personal-Info-Field-Wrapper">
                                    <h2 className="Personal-Info-Field">{"WEIGHT: " + this.state.personalInfoObject.weight + " lb"}</h2>
                                </div>
                            </div>

                            <div className="Personal-Info-Field-Wrapper-Parent">
                                <div className="Personal-Info-Field-Wrapper">
                                    <h2 className="Personal-Info-Field">{"HEIGHT: " + this.state.personalInfoObject.height_feet + " " + this.state.personalInfoObject.height_inches}</h2>
                                </div>
                            </div>

                            {localStorage.getItem("userRole").localeCompare("STUDENT") === 0 ? 
                                <div className="Personal-Info-Field-Wrapper-Parent">
                                    <div className="Personal-Info-Field-Wrapper">
                                        <h2 className="Personal-Info-Field">{"SQUAT MAX: " + this.state.personalInfoObject.squat_max}</h2>
                                    </div>
                                </div>
                                :
                                ""
                            }

                            {localStorage.getItem("userRole").localeCompare("STUDENT") === 0 ?
                                <div className="Personal-Info-Field-Wrapper-Parent">
                                    <div className="Personal-Info-Field-Wrapper">
                                        <h2 className="Personal-Info-Field">{"DEADLIFT MAX: " + this.state.personalInfoObject.deadlift_max}</h2>
                                    </div>
                                </div>
                                :
                                ""
                            }

                            {localStorage.getItem("userRole").localeCompare("STUDENT") === 0 ?
                                <div className="Personal-Info-Field-Wrapper-Parent">
                                    <div className="Personal-Info-Field-Wrapper">
                                        <h2 className="Personal-Info-Field">{"BENCH MAX: " + this.state.personalInfoObject.bench_max}</h2>
                                    </div>
                                </div>
                                :
                                ""
                            }

                            {localStorage.getItem("userRole").localeCompare("STUDENT") === 0 ?
                                <div className="Personal-Info-Field-Wrapper-Parent">
                                    <div className="Personal-Info-Field-Wrapper">
                                        <h2 className="Personal-Info-Field">{"HANG CLEAN MAX: " + this.state.personalInfoObject.hang_clean_max}</h2>
                                    </div>
                                </div>
                                :
                                ""
                            }

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
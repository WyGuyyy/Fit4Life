import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './AdminStudentDetails.css';
import AdminPopout from '../AdminPopout/AdminPopout'
import AdminHeader from '../AdminHeader/AdminHeader';
import { Link } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import {RedirectService} from '../../_services/RedirectService';
import {baseURI} from '../../_services/APIService';

class AdminStudentDetails extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                canGoBack: props.location.state.goBack,
                student: props.location.state.student
            };
        }

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 

    }

    componentDidUpdate(){

    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    goToStudentSchedule(event){

        this.props.history.push({
            pathname: "/schedule",
            state: {goBack: true, student: this.state.student}
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

        var firstName = "FIRST NAME: " + this.props.location.state.student.first_name;
        var lastName = "LAST NAME: " + this.props.location.state.student.last_name;
        var displayName = "DISPLAY NAME: " + this.props.location.state.student.display_name;
        var email = "EMAIL: " + this.props.location.state.student.email;
        var weight = "WEIGHT: " + this.props.location.state.student.weight;
        var height = "HEIGHT: " + this.props.location.state.student.height_feet + "ft " + this.props.location.state.student.height_inches + "in";

        return(
            <Fragment>
                <AdminHeader title="Student Details" breadCrumbs="Student Details" goBack={true} customClick={this.goBack.bind(this)}/>
                <div className="Student-Detail-Container-Admin">
                    <AdminPopout hist={this.props.history}/>
                    <div className="Student-Detail-Wrapper-Admin">
                        <div className="Student-Detail-Form-Wrapper-Admin">
                            <div className="Student-Detail-FirstName-Wrapper-Admin-Parent">
                                <div className="Student-Detail-FirstName-Wrapper-Admin">
                                    <h2 className="Student-Detail-FirstName-Admin">{firstName}</h2>
                                </div>
                            </div>
                            <div className="Student-Detail-LastName-Wrapper-Admin-Parent">
                                <div className="Student-Detail-LastName-Wrapper-Admin">
                                    <h2 className="Student-Detail-LastName-Admin">{lastName}</h2>
                                </div>
                            </div>
                            <div className="Student-Detail-DisplayName-Wrapper-Admin-Parent">
                                <div className="Student-Detail-DisplayName-Wrapper-Admin">
                                    <h2 className="Student-Detail-DisplayName-Admin">{displayName}</h2>
                                </div>
                            </div>
                            <div className="Student-Detail-Email-Wrapper-Admin-Parent">
                                <div className="Student-Detail-Email-Wrapper-Admin">
                                    <h2 className="Student-Detail-Email-Admin">{email}</h2>
                                </div>
                            </div>
                            <div className="Student-Detail-Weight-Wrapper-Admin-Parent">
                                <div className="Student-Detail-Weight-Wrapper-Admin">
                                    <h2 className="Student-Detail-Weight-Admin">{weight}</h2>
                                </div>
                            </div>
                            <div className="Student-Detail-Height-Wrapper-Admin-Parent">
                                <div className="Student-Detail-Height-Wrapper-Admin">
                                    <h2 className="Student-Detail-Height-Admin">{height}</h2>
                                </div>
                            </div>
                            <div className="Student-Detail-Workout-Wrapper-Admin-Parent">
                                <div className="Student-Detail-Workout-Wrapper-Admin" onClick={e => this.goToStudentSchedule(e)}>
                                    <h2 className="Student-Detail-Workout-Admin">{"Check Workout Schedule"}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default AdminStudentDetails;

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
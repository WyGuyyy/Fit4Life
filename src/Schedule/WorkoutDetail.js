import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './WorkoutDetail.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout'
import AdminHeader from '../Admin/AdminHeader/AdminHeader';
import AdminPopout from '../Admin/AdminPopout/AdminPopout';
import ConfirmModal from '../Confirm/ConfirmModal';
import ConfirmToast from '../Confirm/ConfirmToast';
import { Link, Redirect } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { FaDove } from 'react-icons/fa';
import {RedirectService} from '../_services/RedirectService';
import {baseURI} from '../_services/APIService';

class WorkoutDetail extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(this.props.location.state)){
            this.state = {
                workout: props.location.state.workout,
                canGoBack: props.location.state.goBack
            };
        }

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
        this.fillFields();
    }

    componentDidUpdate(){

    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    async fillFields(){

        var aWorkout = "";

        var exercise = document.getElementsByClassName("Workout-Detail-Exercise")[0];
        var thr = document.getElementsByClassName("Workout-Detail-THR")[0];
        var max = document.getElementsByClassName("Workout-Detail-Max")[0];
        var sets = document.getElementsByClassName("Workout-Detail-Sets")[0];
        var reps = document.getElementsByClassName("Workout-Detail-Reps")[0];
        var weight = document.getElementsByClassName("Workout-Detail-Weight")[0];
        var timeOn = document.getElementsByClassName("Workout-Detail-TimeOn")[0];
        var timeOff = document.getElementsByClassName("Workout-Detail-TimeOff")[0];
        var component = document.getElementsByClassName("Workout-Detail-Component")[0];

        var onMinute = 0;
        var onSecond = 0;
        var restMinute = 0;
        var restSecond = 0;

        await fetch(baseURI + "/api/workout/" + this.props.location.state.workout.workout_id, {  
                method: "GET",                          
                headers: {"Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("auth_token")}
            }).then(res => res.text())
            .then((text) => {
 
                var result = text.length ? JSON.parse(text) : {};
                aWorkout = result;

            }).catch(console.log);

            onMinute = (aWorkout.time_on_minute <= 9 ? "0" + aWorkout.time_on_minute : aWorkout.time_on_minute);
            onSecond = (aWorkout.time_on_second <= 9 ? "0" + aWorkout.time_on_second : aWorkout.time_on_second);

            restMinute = (aWorkout.rest_minute <= 9 ? "0" + aWorkout.rest_minute : aWorkout.rest_minute);
            restSecond = (aWorkout.rest_second <= 9 ? "0" + aWorkout.rest_second : aWorkout.rest_second);

            exercise.textContent = "EXERCISE: " + aWorkout.exercise.title;
            thr.textContent = "TARGET HEART RATE: " + aWorkout.target_heart_rate;
            weight.textContent = "WEIGHT: " + aWorkout.weight;
            timeOn.textContent = "TIME ON: " + onMinute + ":" + onSecond;
            timeOff.textContent = "TIME OFF: " + restMinute + ":" + restSecond;
            sets.textContent = "SETS: " + aWorkout.sets;
            reps.textContent = "REPS: " + aWorkout.reps;
            max.textContent = "MAX%: MAX"
            component.textContent = "COMPONENT: " + this.getComponentString(this.props.location.state.workout.components);

            this.setState({
                workout: aWorkout
            });
    }

    getComponentString(compArr){

        var compString = "";

        compString = compArr[0].title;

        for(var count = 1; count < compArr.length; count++){
            compString += ", " + compArr[count].title;
        }

        return compString;
    }

    showModal(event){
        document.getElementById("modalContainer").style.display = "flex";
    }

    closeModal(){
        document.getElementById("modalContainer").style.display = "none";

        this.props.history.replace({pathname: "/Schedule", state: {canGoBack: true}});
    }

    async deleteWorkout(event){

        await fetch(baseURI + "/api/workout/" + this.props.location.state.workout.workout_id, {  
            method: "DELETE",                          
            headers: {"Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        }).catch(console.log);

    }

    goToEditWorkout(event){

        this.props.history.push({
            pathname: "/workoutEdit",
            state: {workout: this.state.workout}
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
                     <Header title="Workout Details" breadCrumbs="Workout Details" goBack={true} customClick={this.goBack.bind(this)}/> : 
                     <AdminHeader title={"Workout Details"} breadCrumbs="Workout Details" goBack={false} customClick={this.goBack.bind(this)}/>}
                     <ConfirmModal text="Delete workout?" yesText="Yes" noText="No" onYes={e => {this.deleteWorkout(e); this.closeModal();}}/>
                    <div className="Workout-Detail-Container">
                        {localStorage.getItem("userRole").localeCompare("STUDENT") === 0 ? 
                         <Popout hist={this.props.history}/> : 
                         <AdminPopout hist={this.props.history}/>}
                        <div className="Workout-Detail-Wrapper">
                            <ConfirmToast text="Workout deleted!"/>
                            <div className="Workout-Detail-Form-Wrapper">
                                <div className="Workout-Detail-Classroom-Wrapper-Parent">
                                    <div className="Workout-Detail-Classroom-Wrapper" id="Workout-Detail-Exercise-Wrapper">
                                        <h2 className="Workout-Detail-Classroom">{"CLASSROOM: " + this.props.location.state.workout.classroom.title}</h2>
                                    </div>
                                </div>
                                <div className="Workout-Detail-Exercise-Wrapper-Parent">
                                    <div className="Workout-Detail-Exercise-Wrapper" id="Workout-Detail-Exercise-Wrapper">
                                        <h2 className="Workout-Detail-Exercise"></h2>
                                    </div>
                                </div>
                                <div className="Workout-Detail-THR-Wrapper-Parent">
                                    <div className="Workout-Detail-THR-Wrapper" id="Workout-Detail-THR-Wrapper">
                                        <h2 className="Workout-Detail-THR"></h2>
                                    </div>
                                </div>
                                <div className="Workout-Detail-Max-Wrapper-Parent">
                                    <div className="Workout-Detail-Max-Wrapper" id="Workout-Detail-Max-Wrapper">
                                        <h2 className="Workout-Detail-Max"></h2>
                                    </div>
                                </div>
                                <div className="Workout-Detail-Sets-Wrapper-Parent" >
                                    <div className="Workout-Detail-Sets-Wrapper" id="Workout-Detail-Sets-Wrapper">
                                        <h2 className="Workout-Detail-Sets"></h2>
                                    </div>
                                </div>
                                <div className="Workout-Detail-Reps-Wrapper-Parent">
                                    <div className="Workout-Detail-Reps-Wrapper" id="Workout-Detail-Reps-Wrapper">
                                        <h2 className="Workout-Detail-Reps"></h2>
                                    </div>
                                </div>
                                <div className="Workout-Detail-Weight-Wrapper-Parent">
                                    <div className="Workout-Detail-Weight-Wrapper" id="Workout-Detail-Weight-Wrapper">
                                        <h2 className="Workout-Detail-Weight"></h2>
                                    </div>
                                </div>
                                <div className="Workout-Detail-TimeOn-Wrapper-Parent">
                                    <div className="Workout-Detail-TimeOn-Wrapper" id="Workout-Detail-TimeOn-Wrapper">
                                        <h2 className="Workout-Detail-TimeOn"></h2>
                                    </div>
                                </div>
                                <div className="Workout-Detail-TimeOff-Wrapper-Parent">
                                    <div className="Workout-Detail-TimeOff-Wrapper" id="Workout-Detail-TimeOff-Wrapper">
                                        <h2 className="Workout-Detail-TimeOff"></h2>
                                    </div>
                                </div>
                                <div className="Workout-Detail-Component-Wrapper-Parent">
                                    <div className="Workout-Detail-Component-Wrapper" id="Workout-Detail-Component-Wrapper">
                                        <h2 className="Workout-Detail-Component"></h2>
                                    </div>
                                </div>
                            </div>
                            <div className="Workout-Detail-Button-Wrapper">
                                <button className="Workout-Detail-EditWorkout" onClick={e => this.goToEditWorkout(e)}>Edit Workout</button>
                                <button className="Workout-Detail-DeleteWorkout" onClick={e => this.showModal(e)}>Delete Workout</button>
                            </div>
                        </div>
                    </div>
                </Fragment>
            );
            
    }

}

export default WorkoutDetail;

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
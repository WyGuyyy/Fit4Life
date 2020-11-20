import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './EditWorkout.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout';
import ConfirmModal from '../Confirm/ConfirmModal';
import ConfirmToast from '../Confirm/ConfirmToast';
import { Link } from 'react-router-dom';
import {RedirectService} from '../_services/RedirectService';
import {DataCheckService} from '../_services/DataCheckService';
import { FaWpbeginner } from 'react-icons/fa';

class EditWorkout extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                workout: props.location.state.workout,
                canGoBack: true
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

    async submitWorkout(event){

        var aTHR = document.getElementById("EditWorkout-Input-THR").value;
        var aWeight = document.getElementById("EditWorkout-Input-Weight").value;
        var aTimeOn = document.getElementById("EditWorkout-Input-TimeOn").value;
        var aRest = document.getElementById("EditWorkout-Input-Rest").value;
        var aSets = document.getElementById("EditWorkout-Input-Sets").value;
        var aReps = document.getElementById("EditWorkout-Input-Reps").value;
        var aDate = document.getElementById("EditWorkout-Input-Date").value;

        var userID = 1;
        var workout = this.state.workout;
        
        workout.target_heart_rate = aTHR;
        workout.weight = aWeight;
        workout.time_on_minute = aTimeOn;
        workout.time_on_second = aTimeOn;
        workout.rest_minute = aRest;
        workout.rest_second = aRest;
        workout.sets = aSets;
        workout.reps = aReps;
        workout.date = aDate;

        var exerciseID = workout.exercise.exercise_id;
        var componentID = workout.component.component_id;
        var classroomID = workout.classroom.classroom_id;

        if(DataCheckService.validateFields([aTHR, aWeight, aTimeOn, aRest, aSets, aReps, aDate])){

            await fetch("http://localhost:8080/api/workout", {  
                method: "PUT",                          
                headers: {"Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("auth_token")},
                body: JSON.stringify(workout)
            }).catch(console.log);

            this.confirmBackendTransaction();

        }else{
            this.showError();
        }

    }

    showModal(event){
        document.getElementById("modalContainer").style.display = "flex";
    }

    closeModal(){
        document.getElementById("modalContainer").style.display = "none";
    }

    showError(){
        // Get the snackbar confirmation
        var confirmation = document.getElementById("snackbar");
        confirmation.innerText = "There are empty fields! Please fill all fields!";
        confirmation.className = "show";
        setTimeout(function(){ confirmation.className = confirmation.className.replace("show", ""); }, 3000);
    }

    confirmBackendTransaction(){
        // Get the snackbar confirmation
        var confirmation = document.getElementById("snackbar");
        confirmation.innerText = "Workout saved!";
        confirmation.className = "show";
        setTimeout(function(){ confirmation.className = confirmation.className.replace("show", ""); }, 3000);
    }

    goBack(){ //This isnt working, start here next time
        console.log(this.props);
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }

    //Render the Header component to the DOM/Screen
    render(){

        if(!RedirectService.checkItemForUndefined(this.props.location.state)){
            return RedirectService.decideRedirect();
        }

        var workout = this.props.location.state.workout;

        var classroom = workout.classroom.title;
        var component = workout.component.title;
        var exercise = workout.exercise.title;

        var aTargetHeartRate = workout.target_heart_rate;
        var aWeight = workout.weight;
        var aTimeOn = workout.time_on_minute;
        var aRest = workout.rest_minute;
        var aSet = workout.sets;
        var aRep = workout.reps;
        var aDate = workout.date.split("T")[0];

        console.log(aDate);

        return(
            <Fragment>
                <Header title={"Edit Workout"} breadCrumbs={"Edit workout for " + classroom + ">" + component + ">" + exercise} goBack={true} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Save workout?" yesText="Yes" noText="No" onYes={e => {this.submitWorkout(); this.closeModal();}}/>
                <div className="editWorkoutContainer">
                    <Popout hist={this.props.history}/>
                    <div className="editWorkoutWrapper">
                        <ConfirmToast text="Workout saved!"/>
                        <div className="editWorkoutForm">
                            <div className="EditWorkout-Title-Row">
                                <h2 className="EditWorkout-Form-Title">Exercise Data</h2>
                            </div>
                            <div className="EditWorkout-Form-Wrapper">
                                <div className="EditWorkout-Details-Row">
                                    <label className="editWorkoutLabel">Target Heart Rate: </label> <input className="editWorkoutInput" id="EditWorkout-Input-THR" type="Number" min="0" max="999" maxLength="9" defaultValue={aTargetHeartRate}/>
                                </div>
                                <div className="EditWorkout-Details-Row">
                                    <label className="editWorkoutLabel">Weight: </label> <input className="editWorkoutInput" id="EditWorkout-Input-Weight" type="number" min="0" max="999" maxLength="9" defaultValue={aWeight}/>
                                </div>
                                <div className="EditWorkout-Details-Row">
                                    <label className="editWorkoutLabel">Time On: </label> <input className="editWorkoutInput" id="EditWorkout-Input-TimeOn" type="number" min="0" max="999" maxLength="9" defaultValue={aTimeOn}/>
                                </div>
                                <div className="EditWorkout-Details-Row">
                                    <label className="editWorkoutLabel">Rest: </label> <input className="editWorkoutInput" id="EditWorkout-Input-Rest" type="number" min="0" max="999" maxLength="9" defaultValue={aRest}/>
                                </div>
                                <div className="EditWorkout-Details-Row">
                                    <label className="editWorkoutLabel">Sets: </label> <input className="editWorkoutInput" id="EditWorkout-Input-Sets" type="Number" min="0" max="999" maxLength="9" defaultValue={aSet}/>
                                </div>
                                <div className="EditWorkout-Details-Row">
                                    <label className="editWorkoutLabel">Reps: </label> <input className="editWorkoutInput" id="EditWorkout-Input-Reps" type="Number" min="0" max="999" maxLength="9" defaultValue={aRep}/>
                                </div>
                                <div className="EditWorkout-Details-Row">
                                    <label className="editWorkoutLabel">Date: </label> <input className="editWorkoutInput" id="EditWorkout-Input-Date" type="date" min="0" max="999" defaultValue={aDate}/>
                                </div>
                                <div className="EditWorkout-Save-Row">
                                    <button className="editWorkoutSave" onClick={(e) => this.showModal(e)}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default EditWorkout;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
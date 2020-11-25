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

var currWorkout = "";

class EditWorkout extends React.Component{

    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                canGoBack: true
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

        var thr = document.getElementById("EditWorkout-Input-THR");
        var weight = document.getElementById("EditWorkout-Input-Weight");
        var timeOn = document.getElementById("EditWorkout-Input-TimeOn");
        var rest = document.getElementById("EditWorkout-Input-Rest");
        var sets = document.getElementById("EditWorkout-Input-Sets");
        var reps = document.getElementById("EditWorkout-Input-Reps");
        var date = document.getElementById("EditWorkout-Input-Date");

        await fetch("/api/workout/" + this.props.location.state.workout.workout_id, {  
                method: "GET",                          
                headers: {"Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("auth_token")}
            }).then(res => res.text())
            .then((text) => {
 
                var result = text.length ? JSON.parse(text) : {};
                aWorkout = result;

            }).catch(console.log);

            thr.value = aWorkout.target_heart_rate;
            weight.value = aWorkout.weight;
            timeOn.value = aWorkout.time_on_minute;
            rest.value = aWorkout.rest_minute;
            sets.value = aWorkout.sets;
            reps.value = aWorkout.reps;
            date.value = aWorkout.date.split("T")[0];
    }

    async submitWorkout(event){

        var aTHR = document.getElementById("EditWorkout-Input-THR").value;
        var aWeight = document.getElementById("EditWorkout-Input-Weight").value;
        var aTimeOn = document.getElementById("EditWorkout-Input-TimeOn").value;
        var aRest = document.getElementById("EditWorkout-Input-Rest").value;
        var aSets = document.getElementById("EditWorkout-Input-Sets").value;
        var aReps = document.getElementById("EditWorkout-Input-Reps").value;
        var aDate = document.getElementById("EditWorkout-Input-Date").value + "T" + this.props.location.state.workout.date.split("T")[1];

        var userID = 1;
        var aWorkout = this.props.location.state.workout;
        
        aWorkout.target_heart_rate = aTHR;
        aWorkout.weight = aWeight;
        aWorkout.time_on_minute = aTimeOn;
        aWorkout.time_on_second = aTimeOn;
        aWorkout.rest_minute = aRest;
        aWorkout.rest_second = aRest;
        aWorkout.sets = aSets;
        aWorkout.reps = aReps;
        aWorkout.date = aDate;

        var exerciseID = aWorkout.exercise.exercise_id;
        var componentID = aWorkout.component.component_id;
        var classroomID = aWorkout.classroom.classroom_id;

        if(DataCheckService.validateFields([aTHR, aWeight, aTimeOn, aRest, aSets, aReps, aDate])){

            await fetch("/api/workout", {  
                method: "PUT",                          
                headers: {"Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("auth_token")},
                body: JSON.stringify(aWorkout)
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
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }

    //Render the Header component to the DOM/Screen
    render(){

        if(!RedirectService.checkItemForUndefined(this.props.location.state)){
            return RedirectService.decideRedirect();
        }

        var classroom = this.props.location.state.workout.classroom.title;
        var component = this.props.location.state.workout.component.title;
        var exercise = this.props.location.state.workout.exercise.title;

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
                                    <label className="editWorkoutLabel">Target Heart Rate: </label> <input className="editWorkoutInput" id="EditWorkout-Input-THR" type="Number" min="0" max="999" maxLength="9" />
                                </div>
                                <div className="EditWorkout-Details-Row">
                                    <label className="editWorkoutLabel">Weight: </label> <input className="editWorkoutInput" id="EditWorkout-Input-Weight" type="number" min="0" max="999" maxLength="9" />
                                </div>
                                <div className="EditWorkout-Details-Row">
                                    <label className="editWorkoutLabel">Time On: </label> <input className="editWorkoutInput" id="EditWorkout-Input-TimeOn" type="number" min="0" max="999" maxLength="9" />
                                </div>
                                <div className="EditWorkout-Details-Row">
                                    <label className="editWorkoutLabel">Rest: </label> <input className="editWorkoutInput" id="EditWorkout-Input-Rest" type="number" min="0" max="999" maxLength="9" />
                                </div>
                                <div className="EditWorkout-Details-Row">
                                    <label className="editWorkoutLabel">Sets: </label> <input className="editWorkoutInput" id="EditWorkout-Input-Sets" type="Number" min="0" max="999" maxLength="9" />
                                </div>
                                <div className="EditWorkout-Details-Row">
                                    <label className="editWorkoutLabel">Reps: </label> <input className="editWorkoutInput" id="EditWorkout-Input-Reps" type="Number" min="0" max="999" maxLength="9" />
                                </div>
                                <div className="EditWorkout-Details-Row">
                                    <label className="editWorkoutLabel">Date: </label> <input className="editWorkoutInput" id="EditWorkout-Input-Date" type="date" min="0" max="999" />
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
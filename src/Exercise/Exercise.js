import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './Exercise.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout';
import ConfirmModal from '../Confirm/ConfirmModal';
import ConfirmToast from '../Confirm/ConfirmToast';
import { Link } from 'react-router-dom';

class Exercise extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            exercise: props.location.state.exercise,
            classroom: props.location.state.classroom,
            component: props.location.state.component,
            canGoBack: true
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

    async submitWorkout(event){

        var aTHR = document.getElementById("Exercise-Input-THR").value;
        var aWeight = document.getElementById("Exercise-Input-Weight").value;
        var aTimeOn = document.getElementById("Exercise-Input-TimeOn").value;
        var aRest = document.getElementById("Exercise-Input-Rest").value;
        var aSets = document.getElementById("Exercise-Input-Sets").value;
        var aReps = document.getElementById("Exercise-Input-Reps").value;
        var aDate = document.getElementById("Exercise-Input-Date").value;

        var userID = 1;
        var exerciseID = this.state.exercise.exercise_id;
        var componentID = this.state.component.component_id;
        var classroomID = this.state.classroom.classroom_id;

        await fetch("http://localhost:8080/api/workout", {  
            method: "POST",                          
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({user: {user_id: userID}, exercise: {exercise_id: exerciseID},
                component: {component_id: componentID}, classroom: {classroom_id: classroomID},
                target_heart_rate: aTHR, weight: aWeight, time_on_minute: aTimeOn, time_on_second: 12, 
                rest_minute: aRest, rest_second: 12, sets: aSets, reps: aReps, date: aDate})
        }).catch(console.log);
        
        document.getElementById("Exercise-Input-THR").value = "";
        document.getElementById("Exercise-Input-Weight").value = "";
        document.getElementById("Exercise-Input-TimeOn").value = "";
        document.getElementById("Exercise-Input-Rest").value = "";
        document.getElementById("Exercise-Input-Sets").value = "";
        document.getElementById("Exercise-Input-Reps").value = "";
        document.getElementById("Exercise-Input-Date").value = "";

    }

    showModal(event){
        document.getElementById("modalContainer").style.display = "flex";
    }

    closeModal(){
        document.getElementById("modalContainer").style.display = "none";
    }

    confirmBackendTransaction(){
        // Get the snackbar confirmation
        var confirmation = document.getElementById("snackbar");
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

        var classroom = this.props.location.state.classroom.title;
        var component = this.props.location.state.component.title;
        var exercise = this.props.location.state.exercise.title;

        return(
            <Fragment>
                <Header title={"Workout"} breadCrumbs={"Create workout for " + classroom + ">" + component + ">" + exercise} goBack={true} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Save workout?" yesText="Yes" noText="No" onYes={e => {this.submitWorkout(); this.closeModal(); this.confirmBackendTransaction();}}/>
                <div className="exerciseContainer">
                    <Popout />
                    <div className="exerciseWrapper">
                        <ConfirmToast text="Workout saved!"/>
                        <div className="exerciseForm">
                            <div className="Exercise-Title-Row">
                                <h2 className="Exercise-Form-Title">Exercise Data</h2>
                            </div>
                            <div className="Exercise-Form-Wrapper">
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Target Heart Rate: </label> <input className="exerciseInput" id="Exercise-Input-THR" type="Number" min="0" max="999"/>
                                </div>
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Weight: </label> <input className="exerciseInput" id="Exercise-Input-Weight" type="Number" min="0" max="999"/>
                                </div>
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Time On: </label> <input className="exerciseInput" id="Exercise-Input-TimeOn" type="Number" min="0" max="999" />
                                </div>
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Rest: </label> <input className="exerciseInput" id="Exercise-Input-Rest" type="Number" min="0" max="999" />
                                </div>
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Sets: </label> <input className="exerciseInput" id="Exercise-Input-Sets" type="Number" min="0" max="999" />
                                </div>
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Reps: </label> <input className="exerciseInput" id="Exercise-Input-Reps" type="Number" min="0" max="999" />
                                </div>
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Date: </label> <input className="exerciseInput" id="Exercise-Input-Date" type="date" min="0" max="999" />
                                </div>
                                <div className="Exercise-Submit-Row">
                                    <button className="exerciseSubmit" onClick={(e) => this.showModal(e)}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default Exercise;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
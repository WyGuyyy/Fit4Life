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
import ScrollPicker from '../ScrollPicker/ScrollPicker';
import { FaWordpress, FaWpbeginner } from 'react-icons/fa';
import {baseURI} from '../_services/APIService';

var currWorkout = "";

class EditWorkout extends React.Component{

    constructor(props){
        super(props); //NEED TO FIX THIS.. COMING BACK AS OLD DATA AFTER UPDATE

        if(RedirectService.checkItemForUndefined(props.location.state)){

            this.state = {
                canGoBack: true,
                workout: props.location.state.workout,
                results: {}
            };

        }

        this.getUpdatedWorkout();

        //this.getUpdatedWorkout();

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
        //var workout = this.getUpdatedWorkout();

        this.fillFields();
    }

    componentDidUpdate(){
        
    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    componentSelect(event){
        var compSelect = document.getElementById("exerciseSelectComponent");
        var options = compSelect.options;
        var noneSelected = true;

        for(var count = 1; count < options.length; count++){
            if(options[count].selected){
                noneSelected = false;
                break;
            }
        }

        if(noneSelected){
            options[0].selected = true;
        }else{
            options[0].selected = false;
        }
    }

    async getUpdatedWorkout(){

        var aWorkout = {};
        var newResult = {};
        const refreshWorkout = async () => await fetch(baseURI + "/api/workout/" + this.props.location.state.workout.workout_id, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        }).then(res => res.text())
        .then((text) => {

            var result = text.length ? JSON.parse(text) : {};
            return result;
        }).catch(console.log);
        aWorkout = await refreshWorkout();
        
        if(this.checkWorkout(aWorkout)){
            console.log("good");
            this.setState({
                workout: aWorkout
            });
            
        }

        /*aWorkout.then(function(res){
            this.setState({
                workout: res,
                results: res
            });

            console.log(res);
        }.bind(this));*/

        /*this.state = {
            workout: aWorkout,
            results: aWorkout
        };*/

    }

    checkWorkout(aWorkout){
        if(aWorkout.time_on_minute !== this.state.workout.time_on_minute ||
            aWorkout.time_on_second !== this.state.workout.time_on_second ||
            aWorkout.rest_minute !== this.state.workout.rest_minute ||
            aWorkout.rest_second !== this.state.workout.rest_second ||
            aWorkout.sets !== this.state.workout.sets ||
            aWorkout.reps !== this.state.workout.reps){
                return true;
        }else{
            return false
        }
    }

    updateTimeOn = (time) => {
        var newResults = this.state.results;

        if(time[0].localeCompare("") === 0){
            time[0] = 0;
        }

        if(time[1].localeCompare("") === 0){
            time[1] = 0;
        }

        //var seconds = (parseInt(time[0]) * 60) + parseInt(time[1]);
        newResults.time_on_minute = parseInt(time[0]);
        newResults.time_on_second = parseInt(time[1]);
        //newResults.timeOn = seconds;
        
        this.setState({
            results: newResults
        });
    }

    updateRest = (time) => {
        var newResults = this.state.results;

        if(time[0].localeCompare("") === 0){
            time[0] = 0;
        }

        if(time[1].localeCompare("") === 0){
            time[1] = 0;
        }

        //var seconds = (parseInt(time[0]) * 60) + parseInt(time[1]);
        newResults.rest_minute = parseInt(time[0]);
        newResults.rest_second = parseInt(time[1]);

        this.setState({
            results: newResults
        });
    }

    updateSets = (sets) => {
        var newResults = this.state.results;
        newResults.sets = parseInt(sets[0]);

        this.setState({
            results: newResults
        });
    }

    updateReps = (reps) => {
        var newResults = this.state.results;
        newResults.reps = parseInt(reps[0]);

        this.setState({
            results: newResults
        });
    }

    async fillFields(){

        await this.getUpdatedWorkout();

        var aWorkout = "";

        var componentSelect = document.getElementById("editWorkoutSelectComponent");
        var thr = document.getElementById("editWorkoutSelectTHR");
        var weight = document.getElementById("EditWorkout-Input-Weight");
        var date = document.getElementById("EditWorkout-Input-Date");

        await fetch(baseURI + "/api/workout/" + this.props.location.state.workout.workout_id, {  
                method: "GET",                          
                headers: {"Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("auth_token")}
            }).then(res => res.text())
            .then((text) => {
 
                var result = text.length ? JSON.parse(text) : {};
                aWorkout = result;

            }).catch(console.log);

            this.activateSelectedComponents(componentSelect, this.props.location.state.workout.components);
            this.activateSelectedTHR(thr, this.props.location.state.workout.target_heart_rate);

            weight.value = aWorkout.weight;
            date.value = aWorkout.date;//.split("T")[0];
    }

    async submitWorkout(event){

        var aWorkout = this.props.location.state.workout;

        var results = this.state.results;

        var aTHR = document.getElementById("editWorkoutSelectTHR");
        aTHR = aTHR.options[aTHR.selectedIndex].textContent;

        var componentOptions = document.getElementById("editWorkoutSelectComponent").options;
        var count = 0;
        var componentsArr = [];

        for(count = 0; count < componentOptions.length; count++){
            var opt = componentOptions[count];

            if(opt.selected){
                componentsArr.push({component_id: count + 1, title: opt.text});
            }
        }

        var aWeight = document.getElementById("EditWorkout-Input-Weight").value;
        var timeOnMinute = (results.time_on_minute === undefined ? aWorkout.time_on_minute : results.time_on_minute);
        var timeOnSecond = (results.time_on_second === undefined ? aWorkout.time_on_second : results.time_on_second);
        var timeOffMinute = (results.rest_minute == undefined ? aWorkout.rest_minute : results.rest_minute);
        var timeOffSecond = (results.rest_second === undefined ? aWorkout.rest_second : results.rest_second);
        var aSets = (results.sets === undefined ? aWorkout.sets : results.sets);
        var aReps = (results.reps === undefined ? aWorkout.reps : results.reps);
        var aDate = document.getElementById("EditWorkout-Input-Date").value;
        var workoutID = this.state.workout.workout_id;
        var userID = localStorage.getItem("userID"); 
        var exerciseID = this.state.workout.exercise.exercise_id;
       // var componentID = this.state.component.component_id;
        var classroomID = this.state.workout.classroom.classroom_id;


        aWorkout.workout_id = workoutID;
        aWorkout.user = {user_id: userID};
        aWorkout.exercise = {exercise_id: exerciseID};
        aWorkout.classroom = {classroom_id: classroomID};
        aWorkout.components = componentsArr;
        aWorkout.target_heart_rate = aTHR;
        aWorkout.weight = aWeight;
        aWorkout.time_on_minute = timeOnMinute;
        aWorkout.time_on_second = timeOnSecond;
        aWorkout.rest_minute = timeOffMinute;
        aWorkout.rest_second = timeOffSecond;
        aWorkout.sets = aSets;
        aWorkout.reps = aReps;
        aWorkout.date = aDate;

        var workoutID = this.state.workout.workout_id;
        var userID = localStorage.getItem("userID"); 
        var exerciseID = this.state.workout.exercise.exercise_id;
       // var componentID = this.state.component.component_id;
        var classroomID = this.state.workout.classroom.classroom_id;

        if(DataCheckService.validateFields([aDate])  && componentsArr.length > 0){//[aTHR, aWeight, aTimeOn, aRest, aSets, aReps, aDate])){

            await fetch(baseURI + "/api/workout", {  
                method: "POST",                          
                headers: {"Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("auth_token")},
                body: JSON.stringify(aWorkout)
            }).catch(console.log);
            
            //document.getElementById("Exercise-Input-THR").value = "";
            //document.getElementById("EditWorkout-Input-Weight").value = "";
            //document.getElementById("Exercise-Input-TimeOn").value = "";
            //document.getElementById("Exercise-Input-Rest").value = "";
            //document.getElementById("Exercise-Input-Sets").value = "";
            //document.getElementById("Exercise-Input-Reps").value = "";
            //document.getElementById("EditWorkout-Input-Date").value = "";

            this.confirmBackendTransaction();

            this.setState({
                workout: aWorkout
            });

            this.props.history.replace({
                pathname: '/workoutEdit',
                state: {workout: aWorkout}
            });

        }else{
            this.showError();
        }

    }

    activateSelectedComponents(compSelect, components){

        var componentOptions = compSelect.options;
        var titles = [];
        var count = 0;

        for(var titleCount = 0; titleCount < components.length; titleCount++){
            titles.push(components[titleCount].title);
        }

        for(count = 0; count < 4; count++){
            var opt = componentOptions[count];
            if(titles.includes(opt.text)){
                opt.selected = true;
            }
        }
    }

    activateSelectedTHR(thrSelect, thr){

        var thrOptions = thrSelect.options;
        var count = 0;

        for(count = 0; count < thrOptions.length; count++){
            var opt = thrOptions[count];
            if(opt.text.localeCompare(thr) === 0){
                opt.selected = true;
            }
        }

    }

    checkDate(event){

        var value = event.target.value;
        var day = new Date(value).getUTCDay();

        if([6,0].includes(day)){
            event.target.value = '';
            this.showIllegalDate();
        }


    }

    showIllegalDate(){
        // Get the snackbar confirmation
        var confirmation = document.getElementById("snackbar");
        confirmation.innerText = "Date cannot be a day of the weekend! Please choose a different day!";
        confirmation.className = "show";
        setTimeout(function(){ confirmation.className = confirmation.className.replace("show", ""); }, 3000);
    }

    /*async submitWorkout(event){

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
        //var componentID = aWorkout.component.component_id;
        var classroomID = aWorkout.classroom.classroom_id;

        if(DataCheckService.validateFields([aTHR, aWeight, aTimeOn, aRest, aSets, aReps, aDate])){

            await fetch(baseURI + "/api/workout", {  
                method: "PUT",                          
                headers: {"Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("auth_token")},
                body: JSON.stringify(aWorkout)
            }).catch(console.log);

            this.confirmBackendTransaction();

        }else{
            this.showError();
        }

    }*/

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
       // var component = this.props.location.state.workout.component.title;
        var exercise = this.props.location.state.workout.exercise.title;

        var count = 0;

        var timeArr = [];

        var secondsArr = [];
        var minuteArr = [];

        var setsArr = [];
        var repsArr = [];

        for(count = 0; count < 60; count++){
            secondsArr.push(count);
            minuteArr.push(count);
        }

        timeArr.push(minuteArr);
        timeArr.push(secondsArr);

        for(count = 0; count <= 10; count++){
            setsArr.push(count);
        }

        for(count = 0; count <= 20; count++){
            repsArr.push(count);
        }

        var onMinutes = this.state.workout.time_on_minute;
        onMinutes = (onMinutes === -1 ? 0 : onMinutes);

        var onSeconds = this.state.workout.time_on_second;
        onSeconds = (onSeconds === -1 ? 0 : onSeconds);

        var offMinutes = this.state.workout.rest_minute;
        offMinutes = (offMinutes === -1 ? 0 : offMinutes);

        var offSeconds = this.state.workout.rest_second;
        offSeconds = (offSeconds === -1 ? 0 : offSeconds);

        var sets = this.state.workout.sets;
        sets = (sets === -1 ? 0 : sets);

        var reps = this.state.workout.reps;
        reps = (reps === -1 ? 0 : reps);

        return(
            <Fragment>
                <Header title={"Edit Workout"} breadCrumbs={"Edit workout for " + classroom + ">" + exercise} goBack={true} customClick={this.goBack.bind(this)}/>
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
                                    <label className="editWorkoutLabel">Exercise: </label><input className="editWorkoutInput" id="EditWorkout-Input-Exercise" type="text" readOnly defaultValue={this.props.location.state.workout.exercise.title}/>
                                </div>
                                <div className="EditWorkout-Details-Row" id="EditWorkout-Details-Row-Component">
                                    <label className="editWorkoutLabel">Components: </label> 
                                    <select className="editWorkoutSelect" id="editWorkoutSelectComponent" multiple={true} onChange={e => this.componentSelect(e)}>
                                        <option value="None">None</option>
                                        <option value="Cardiovascular Endurance">Cardiovascular Endurance</option>
                                        <option value="Muscular Strength">Muscular Strength</option>
                                        <option value="Muscular Endurance">Muscular Endurance</option>
                                        <option value="Flexibility">Flexibility</option>
                                    </select>
                                </div>
                                <div className="EditWorkout-Details-Row" id="EditWorkout-Details-Row-THR">
                                    <label className="editWorkoutLabel">Target Heart Rate: </label> 
                                    <select className="editWorkoutSelect" id="editWorkoutSelectTHR">
                                        <option value="none" selected={true}>None</option>
                                        <option value="zone1">Zone 1 (104-124 bpm)</option>
                                        <option value="zone2">Zone 2 (124-144 bpm)</option>
                                        <option value="zone3">Zone 3 (144-164 bpm)</option>
                                        <option value="zone4">Zone 4 (164-184 bpm)</option>
                                        <option value="zone5">Zone 5 (184-206 bpm)</option>
                                    </select>
                                </div>
                                <div className="EditWorkout-Details-Row">
                                    <label className="editWorkoutLabel">Weight (lb): </label> <input className="editWorkoutInput" id="EditWorkout-Input-Weight" type="Number" min="0" max="999" maxLength="9"/>
                                </div>
                                <div className="EditWorkout-Details-Row">
                                    <label className="editWorkoutLabel">Time On: </label> <ScrollPicker columnTitles={["Minutes", "Seconds"]} columnItems={timeArr} controlWrapperID={"TimeOn"} updateResults={this.updateTimeOn} type={"Dependent"} dependentConfig={[60, 60]} defaultPosition={[onMinutes, onSeconds]}/>
                                </div>
                                <div className="EditWorkout-Details-Row">
                                    <label className="editWorkoutLabel">Rest: </label> <ScrollPicker columnTitles={["Minutes", "Seconds"]} columnItems={timeArr} controlWrapperID={"Rest"} updateResults={this.updateRest} type={"Dependent"} dependentConfig={[60, 60]} defaultPosition={[offMinutes, offSeconds]}/>
                                </div>
                                <div className="EditWorkout-Details-Row">
                                    <label className="editWorkoutLabel">Sets: </label> <ScrollPicker columnTitles={["Sets"]} columnItems={[setsArr]} controlWrapperID={"Sets"} updateResults={this.updateSets} defaultPosition={[sets]}/>
                                </div>
                                <div className="EditWorkout-Details-Row">
                                    <label className="editWorkoutLabel">Reps: </label> <ScrollPicker columnTitles={["Reps"]} columnItems={[repsArr]} controlWrapperID={"Reps"} updateResults={this.updateReps} defaultPosition={[reps]}/>
                                </div>
                                <div className="EditWorkout-Details-Row">
                                    <label className="editWorkoutLabel">Date: </label> <input className="editWorkoutInput" id="EditWorkout-Input-Date" type="date" min="0" max="999" onChange={e => this.checkDate(e)}/>
                                </div>
                                <div className="EditWorkout-Submit-Row">
                                    <button className="editWorkoutSubmit" onClick={(e) => this.showModal(e)}>Submit</button>
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
/*
                <Header title={"Edit Workout"} breadCrumbs={"Edit workout for " + classroom + ">" + exercise} goBack={true} customClick={this.goBack.bind(this)}/>
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
                        </div>*/ 
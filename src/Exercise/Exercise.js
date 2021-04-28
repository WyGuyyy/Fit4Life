import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './Exercise.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout';
import ConfirmModal from '../Confirm/ConfirmModal';
import ConfirmToast from '../Confirm/ConfirmToast';
import ScrollPicker from '../ScrollPicker/ScrollPicker';
import { Link } from 'react-router-dom';
import {RedirectService} from '../_services/RedirectService';
import {DataCheckService} from '../_services/DataCheckService';
import {baseURI} from '../_services/APIService';

class Exercise extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){

            var initResults = {
                exercise: "",
                components: [],
                thr: "",
                weight: "",
                /*timeOnMinutes: "",
                timeOnSeconds: "",
                restMinutes: "",
                restSeconds: "",
                sets: "",
                reps: "",*/
                date: ""
            };

            this.state = {
                exercise: props.location.state.exercise,
                classroom: props.location.state.classroom,
                canGoBack: true,
                results: initResults
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

    /*updateTimeOn = (time) => { //start here and change time on and off to correct sc and min
        var newResults = this.state.results;

        if(time[0].localeCompare("") === 0){
            time[0] = 0;
        }

        if(time[1].localeCompare("") === 0){
            time[1] = 0;
        }

        //var seconds = (parseInt(time[0]) * 60) + parseInt(time[1]);
        newResults.timeOnMinutes = time[0];
        newResults.timeOnSeconds = time[1];
        
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
        newResults.restMinutes = time[0];
        newResults.restSeconds = time[1];

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
    }*/

    async submitWorkout(event){

        var aWorkout = {
            user: "",
            exercise: "",
            classroom: "",
            components: "",
            target_heart_rate: "",
            weight: "",
            max: "",
            time_on_minute: "",
            time_on_second: "",
            rest_minute: "",
            rest_second: "",
            sets: "",
            reps: "",
            date: ""
        };

        var aTHR = document.getElementById("exerciseSelectTHR");
        aTHR = aTHR.options[aTHR.selectedIndex].textContent;

        var componentOptions = document.getElementById("exerciseSelectComponent").options;
        var count = 0;
        var componentsArr = [];

        for(count = 0; count < componentOptions.length; count++){
            var opt = componentOptions[count];

            if(opt.selected){
                componentsArr.push({component_id: count + 1, title: opt.text});
            }
        }

        var aWeight = document.getElementById("Exercise-Input-Weight").value;
        var max = document.getElementsByClassName("Max-Details")[0].value;
        var timeOnMinute = document.getElementsByClassName("TimeOn-Details-Minute")[0].value;
        var timeOnSecond = document.getElementsByClassName("TimeOn-Details-Second")[0].value;
        var restMinute = document.getElementsByClassName("Rest-Details-Minute")[0].value;
        var restSecond = document.getElementsByClassName("Rest-Details-Second")[0].value;
        var sets = document.getElementsByClassName("Sets-Details")[0].value;
        var reps = document.getElementsByClassName("Reps-Details")[0].value;
       // var aTimeOn =""; //document.getElementById("Exercise-Input-TimeOn").value;
       // var aRest = "";//document.getElementById("Exercise-Input-Rest").value;
       // var aSets = "";//document.getElementById("Exercise-Input-Sets").value;
       // var aReps = "";//document.getElementById("Exercise-Input-Reps").value;
        var aDate = document.getElementById("Exercise-Input-Date").value;

        var userID = localStorage.getItem("userID"); 
        var exerciseID = this.state.exercise.exercise_id;
       // var componentID = this.state.component.component_id;
        var classroomID = this.state.classroom.classroom_id;

        aWorkout.user = {user_id: userID};
        aWorkout.exercise = {exercise_id: exerciseID};
        aWorkout.classroom = {classroom_id: classroomID};
        aWorkout.components = componentsArr;
        aWorkout.target_heart_rate = aTHR;
        aWorkout.weight = (aWeight.localeCompare("") === 0 ? -1 : aWeight);
        aWorkout.max = (max.localeCompare("") === 0 ? -1 : max);
        /*aWorkout.time_on_minute = this.state.results.timeOnMinutes;
        aWorkout.time_on_second = this.state.results.timeOnSeconds;
        aWorkout.rest_minute = this.state.results.restMinutes;
        aWorkout.rest_second = this.state.results.restSeconds;
        aWorkout.sets = this.state.results.sets;
        aWorkout.reps = this.state.results.reps;*/
        aWorkout.time_on_minute = (timeOnMinute.localeCompare("") === 0 ? -1 : timeOnMinute);
        aWorkout.time_on_second = (timeOnSecond.localeCompare("") === 0 ? -1 : timeOnSecond);
        aWorkout.rest_minute = (restMinute.localeCompare("") === 0 ? -1 : restMinute);
        aWorkout.rest_second = (restSecond.localeCompare("") === 0 ? -1 : restSecond);
        aWorkout.sets = (sets.localeCompare("") === 0 ? -1 : sets);
        aWorkout.reps = (reps.localeCompare("") === 0 ? -1 : reps);
        aWorkout.date = aDate;

        if(DataCheckService.validateFields([aDate]) && componentsArr.length > 0){//[aTHR, aWeight, aTimeOn, aRest, aSets, aReps, aDate])){

            await fetch(baseURI + "/api/workout", {  
                method: "POST",                          
                headers: {"Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("auth_token")},
                body: JSON.stringify(aWorkout)
            }).catch(console.log);
            
            //document.getElementById("Exercise-Input-THR").value = "";
            document.getElementById("Exercise-Input-Weight").value = "";
            document.getElementsByClassName("Max-Details")[0].value = "";
            document.getElementsByClassName("TimeOn-Details-Minute")[0].value = "";
            document.getElementsByClassName("TimeOn-Details-Second")[0].value = "";
            document.getElementsByClassName("Rest-Details-Minute")[0].value = "";
            document.getElementsByClassName("Rest-Details-Second")[0].value = "";
            document.getElementsByClassName("Sets-Details")[0].value = "";
            document.getElementsByClassName("Reps-Details")[0].value = "";
            //document.getElementById("Exercise-Input-TimeOn").value = "";
            //document.getElementById("Exercise-Input-Rest").value = "";
            //document.getElementById("Exercise-Input-Sets").value = "";
            //document.getElementById("Exercise-Input-Reps").value = "";
            document.getElementById("Exercise-Input-Date").value = "";

            this.confirmBackendTransaction();

        }else{
            this.showError();
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

    checkMax(event, max){
        var input = event.target;
        var value = parseInt(input.value);
        
        if(value > max){
            input.value = max;
        }else if(value < 0){
            input.value = 0;
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

    showIllegalDate(){
        // Get the snackbar confirmation
        var confirmation = document.getElementById("snackbar");
        confirmation.innerText = "Date cannot be a day of the weekend! Please choose a different day!";
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

        var classroom = this.props.location.state.classroom.title;
        //var component = this.props.location.state.component.title;
        var exercise = this.props.location.state.exercise.title;

        /*var count = 0;

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
        }*/

        return(
            <Fragment>
                <Header title={"Workout"} breadCrumbs={"Create workout for " + classroom + ">" + exercise} goBack={true} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Save workout?" yesText="Yes" noText="No" onYes={e => {this.submitWorkout(); this.closeModal();}}/>
                <div className="exerciseContainer">
                    <Popout hist={this.props.history}/>
                    <div className="exerciseWrapper">
                        <ConfirmToast text="Workout saved!"/>
                        <div className="exerciseForm">
                            <div className="Exercise-Title-Row">
                                <h2 className="Exercise-Form-Title">Exercise Data</h2>
                            </div>
                            <div className="Exercise-Form-Wrapper">
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Exercise: </label><input className="exerciseInput" id="Exercise-Input-Exercise" type="text" readOnly defaultValue={this.props.location.state.exercise.title}/>
                                </div>
                                <div className="Exercise-Details-Row" id="Exercise-Details-Row-Component">
                                    <label className="exerciseLabel">Components: </label> 
                                    <select className="exerciseSelect" id="exerciseSelectComponent" multiple={true} onChange={e => this.componentSelect(e)}>
                                        <option value="None" selected={true}>None</option>
                                        <option value="Cardiovascular Endurance">Cardiovascular Endurance</option>
                                        <option value="Muscular Strength">Muscular Strength</option>
                                        <option value="Muscular Endurance">Muscular Endurance</option>
                                        <option value="Flexibility">Flexibility</option>
                                    </select>
                                </div>
                                <div className="Exercise-Details-Row" id="Exercise-Details-Row-THR">
                                    <label className="exerciseLabel">Target Heart Rate: </label> 
                                    <select className="exerciseSelect" id="exerciseSelectTHR">
                                        <option value="none" selected={true}>None</option>
                                        <option value="zone1">Zone 1 (104-124 bpm)</option>
                                        <option value="zone2">Zone 2 (124-144 bpm)</option>
                                        <option value="zone3">Zone 3 (144-164 bpm)</option>
                                        <option value="zone4">Zone 4 (164-184 bpm)</option>
                                        <option value="zone5">Zone 5 (184-206 bpm)</option>
                                    </select>
                                </div>
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Weight (lb): </label> <input className="exerciseInput" id="Exercise-Input-Weight" type="Number" min="0" max="999" maxLength="9" onBlur={e => this.checkMax(e, 9999)}/>
                                </div>
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Max%: </label> 
                                    <div className="Max-Wrapper">
                                        <div className="Max-Details-Wrapper">
                                            <input className="Max-Details" type="number" onBlur={e => this.checkMax(e, 100)}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Time On: </label> 
                                    <div className="TimeOn-Wrapper">
                                        <div className="TimeOn-Minute-Wrapper">
                                            <label className="TimeOn-Details-Minute-Label">Minute</label>
                                            <input className="TimeOn-Details-Minute" type="number" onBlur={e => this.checkMax(e, 30)}/>
                                        </div>
                                        <div className="TimeOn-Second-Wrapper">
                                            <label className="TimeOn-Details-Second-Label">Second</label>
                                            <input className="TimeOn-Details-Second" type="number" onBlur={e => this.checkMax(e, 59)}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Rest: </label> 
                                    <div className="Rest-Wrapper">
                                        <div className="Rest-Minute-Wrapper">
                                            <label className="Rest-Details-Minute-Label">Minute</label>
                                            <input className="Rest-Details-Minute" type="number" onBlur={e => this.checkMax(e, 30)}/>
                                        </div>
                                        <div className="Rest-Second-Wrapper">
                                            <label className="Rest-Details-Second-Label">Second</label>
                                            <input className="Rest-Details-Second" type="number" onBlur={e => this.checkMax(e, 59)}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Sets: </label> 
                                    <div className="Sets-Wrapper">
                                        <div className="Sets-Details-Wrapper">
                                            <input className="Sets-Details" type="number" onBlur={e => this.checkMax(e, 20)}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Reps: </label> 
                                    <div className="Reps-Wrapper">
                                        <div className="Reps-Details-Wrapper">
                                            <input className="Reps-Details" type="number" onBlur={e => this.checkMax(e, 50)}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Date: </label> <input className="exerciseInput" id="Exercise-Input-Date" type="date" min="0" max="999" onChange={e => this.checkDate(e)}/>
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
/*
<div className="Exercise-Details-Row">
    <label className="exerciseLabel">Time On: </label> <input className="exerciseInput" id="Exercise-Input-TimeOn" type="Number" min="0" max="999" maxLength="9"/>
                                </div>
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Rest: </label> <input className="exerciseInput" id="Exercise-Input-Rest" type="Number" min="0" max="999" maxLength="9"/>
                                </div>
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Sets: </label> <input className="exerciseInput" id="Exercise-Input-Sets" type="Number" min="0" max="999" maxLength="9"/>
                                </div>
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Reps: </label> <input className="exerciseInput" id="Exercise-Input-Reps" type="Number" min="0" max="999" maxLength="9"/>
                                </div>
*/

/*
<div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Time On: </label> <ScrollPicker columnTitles={["Minutes", "Seconds"]} columnItems={timeArr} controlWrapperID={"TimeOn"} updateResults={this.updateTimeOn} type={"Dependent"} dependentConfig={[60, 60]}/>
                                </div>
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Rest: </label> <ScrollPicker columnTitles={["Minutes", "Seconds"]} columnItems={timeArr} controlWrapperID={"Rest"} updateResults={this.updateRest} type={"Dependent"} dependentConfig={[60, 60]}/>
                                </div>
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Sets: </label> <ScrollPicker columnTitles={["Sets"]} columnItems={[setsArr]} controlWrapperID={"Sets"} updateResults={this.updateSets}/>
                                </div>
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Reps: </label> <ScrollPicker columnTitles={["Reps"]} columnItems={[repsArr]} controlWrapperID={"Reps"} updateResults={this.updateReps}/>
                                </div>
*/
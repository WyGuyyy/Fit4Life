import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './BlowupDayContent.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout'
import { Link } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import {baseURI} from '../_services/APIService';

class BlowupDayContent extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            dayOfWeek: props.dayOfWeek,
            workout: props.workout,
            index: props.index,
            count: props.count,
            day: props.day,
            history: props.history
        };

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
        //this.fillWorkoutContent(this.props.index);
    }

    componentDidUpdate(){

    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    onWorkoutClick(event){

        if(!(this.state.index === 0)){
            this.state.history.push({
                pathname: "/workoutDetail",
                state: {goBack: true, workout: this.state.workout}
            });
        }
    }

    returnNonNegativeValue(value){
        return value === -1 ? 0 : value;
    }

    fillWorkoutContent(index){

        var workout = this.state.workout;

        var elements = [];

        if(index === 0){
            var typeDiv = <div className="BlowupDay-Type" ><p className="BlowupDay-Type-Content" id="exerciseTitle">{"Exercise"}</p></div>;
            var thrDiv = <div className="BlowupDay-THR" ><p className="BlowupDay-THR-Content" id="thrTitle">{"THR"}</p></div>;
            var maxDiv = <div className="BlowupDay-Max" ><p className="BlowupDay-Max-Content" id="maxTitle">{"Max %"}</p></div>;
            var setsDiv = <div className="BlowupDay-Sets" ><p className="BlowupDay-Sets-Content" id="setsTitle">{"Sets"}</p></div>;
            var repsDiv = <div className="BlowupDay-Reps" ><p className="BlowupDay-Reps-Content" id="repsTitle">{"Reps"}</p></div>;
            var weightDiv = <div className="BlowupDay-Weight" ><p className="BlowupDay-Weight-Content" id="weightTitle">{"Weight"}</p></div>;
            var timeOnDiv = <div className="BlowupDay-TimeOn" ><p className="BlowupDay-TimeOn-Content" id="timeOnTitle">{"Time On"}</p></div>;
            var timeOffDiv = <div className="BlowupDay-TimeOff" ><p className="BlowupDay-TimeOff-Content" id="timeOffTitle">{"Time Off"}</p></div>;
            var frequencyDiv = <div className="BlowupDay-Frequency" ><p className="BlowupDay-Frequency-Content" id="componentTitle">{"Component"}</p></div>;
        }else{
            var typeDiv = <div className="BlowupDay-Type"><p className="BlowupDay-Type-Content">{workout.exercise.title}</p></div>;
            var thrDiv = <div className="BlowupDay-THR"><p className="BlowupDay-THR-Content">{workout.target_heart_rate.localeCompare("None") === 0 ? "" : workout.target_heart_rate}</p></div>;
            var maxDiv = <div className="BlowupDay-Max"><p className="BlowupDay-Max-Content">{(workout.max === -1 ? "" : workout.max + "%")}</p></div>;
            var setsDiv = <div className="BlowupDay-Sets"><p className="BlowupDay-Sets-Content">{workout.sets === -1 ? "" : workout.sets}</p></div>;
            var repsDiv = <div className="BlowupDay-Reps"><p className="BlowupDay-Reps-Content">{workout.reps === -1 ? "" : workout.reps}</p></div>;
            var weightDiv = <div className="BlowupDay-Weight"><p className="BlowupDay-Weight-Content">{workout.weight === -1 ? "" : workout.weight}</p></div>;
            var timeOnDiv = <div className="BlowupDay-TimeOn"><p className="BlowupDay-TimeOn-Content">{this.formatTime(workout.time_on_minute, workout.time_on_second)}</p></div>;
            var timeOffDiv = <div className="BlowupDay-TimeOff"><p className="BlowupDay-TimeOff-Content">{this.formatTime(workout.rest_minute, workout.rest_second)}</p></div>;
            var frequencyDiv = <div className="BlowupDay-Frequency">{this.getComponentString(workout.components)}</div>;
        }

        elements.push(typeDiv);
        elements.push(thrDiv);
        elements.push(maxDiv);
        elements.push(setsDiv);
        elements.push(repsDiv);
        elements.push(weightDiv);
        elements.push(timeOnDiv);
        elements.push(timeOffDiv);
        elements.push(frequencyDiv);
        
        return elements;
    }

    getComponentString(compArr){

        var compStringArr = [];
        
        if(compArr.length === 0 || compArr[0] === undefined || compArr[0] === null){
            return "";
        }

        if(compArr[0].title.localeCompare("None") === 0){
            return "";
        }

        for(var count = 0; count < compArr.length; count++){
            compStringArr.push(<p className="BlowupDay-Frequency-Content">{compArr[count].title}<br/></p>);
            compStringArr.push();
        }

        return compStringArr;
    }

    formatTime(minuteValue, secondValue){

        if(minuteValue === -1 && secondValue === -1){
            return "";
        }

        return this.returnNonNegativeValue(minuteValue) + "m " + this.returnNonNegativeValue(secondValue) + "s";
    }

    changeListItemBackground(event){
        if(this.state.index !== 0){
            document.getElementById("BlowupDay-Row-Content-Wrapper-" + this.state.day + "-" + this.state.count).style.background = "#ffbb00";
        }
    }

    returnListItemBackground(event){
        if(this.state.index !== 0){
            if(this.state.count % 2 === 0){
                document.getElementById("BlowupDay-Row-Content-Wrapper-" + this.state.day + "-" + this.state.count).style.background = "#aa7d00";
            }else{
                document.getElementById("BlowupDay-Row-Content-Wrapper-" + this.state.day + "-" + this.state.count).style.background = "#daa000";
            }
        }

    }

    //Render the Header component to the DOM/Screen
    render(){

        //var dayOfWeek = (this.props.dayOfWeek.localeCompare("Title") === 0 ? "" : this.props.dayOfWeek);
        var h = (this.props.index === 0 ? "100%" : "50%");

        var backColor = (this.props.index === 0 ? "#b98800" : (this.props.count % 2 === 0 ? "#aa7d00" : " #daa000"));

        return(

                <div className="BlowupDay-Row-Content-Wrapper" id={"BlowupDay-Row-Content-Wrapper-" + this.props.day + "-" + this.props.count} style={{height: h, background: backColor}} onClick={e => this.onWorkoutClick(e)} onMouseEnter={e => this.changeListItemBackground(e)} onMouseLeave={e => this.returnListItemBackground(e)}>
                    {this.fillWorkoutContent(this.props.index)}
                </div>                 
                                
        );
            
    }
}

export default BlowupDayContent;

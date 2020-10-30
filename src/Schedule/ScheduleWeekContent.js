import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './ScheduleWeekContent.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout'
import { Link } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

class ScheduleWeekContent extends React.Component{
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

    fillWorkoutContent(index){
        
        //var contentWrapperArr = document.getElementsByClassName("ScheduleWeek-Row-Content-Wrapper");
        //var contentWrapper = contentWrapperArr[contentWrapperArr.length - 1];
        //var contentWrapper = document.createElement("div");
        //contentWrapper.classList.add("ScheduleWeek-Row-Content-Wrapper");
        var workout = this.state.workout;

        var elements = [];

        /*var typeDiv = document.createElement("div");
        var thrDiv = document.createElement("div");
        var maxDiv = document.createElement("div");
        var setsDiv = document.createElement("div");
        var repsDiv = document.createElement("div");
        var weightDiv = document.createElement("div");
        var timeOnDiv = document.createElement("div");
        var timeOffDiv = document.createElement("div");
        var frequencyDiv = document.createElement("div");*/

        console.log(index);

        if(index === 0){
            var typeDiv = <div className="ScheduleWeek-Type" ><p className="ScheduleWeek-Type-Content" id="exerciseTitle">{"Exercise"}</p></div>;
            var thrDiv = <div className="ScheduleWeek-THR" ><p className="ScheduleWeek-THR-Content" id="thrTitle">{"THR"}</p></div>;
            var maxDiv = <div className="ScheduleWeek-Max" ><p className="ScheduleWeek-Max-Content" id="maxTitle">{"Max %"}</p></div>;
            var setsDiv = <div className="ScheduleWeek-Sets" ><p className="ScheduleWeek-Sets-Content" id="setsTitle">{"Sets"}</p></div>;
            var repsDiv = <div className="ScheduleWeek-Reps" ><p className="ScheduleWeek-Reps-Content" id="repsTitle">{"Reps"}</p></div>;
            var weightDiv = <div className="ScheduleWeek-Weight" ><p className="ScheduleWeek-Weight-Content" id="weightTitle">{"Weight"}</p></div>;
            var timeOnDiv = <div className="ScheduleWeek-TimeOn" ><p className="ScheduleWeek-TimeOn-Content" id="timeOnTitle">{"Time On"}</p></div>;
            var timeOffDiv = <div className="ScheduleWeek-TimeOff" ><p className="ScheduleWeek-TimeOff-Content" id="timeOffTitle">{"Time Off"}</p></div>;
            var frequencyDiv = <div className="ScheduleWeek-Frequency" ><p className="ScheduleWeek-Frequency-Content" id="componentTitle">{"Component"}</p></div>;
        }else{
            console.log(workout);
            var typeDiv = <div className="ScheduleWeek-Type"><p className="ScheduleWeek-Type-Content">{workout.exercise.title}</p></div>;
            var thrDiv = <div className="ScheduleWeek-THR"><p className="ScheduleWeek-THR-Content">{workout.target_heart_rate}</p></div>;
            var maxDiv = <div className="ScheduleWeek-Max"><p className="ScheduleWeek-Max-Content">{"MAX%"}</p></div>;
            var setsDiv = <div className="ScheduleWeek-Sets"><p className="ScheduleWeek-Sets-Content">{workout.sets}</p></div>;
            var repsDiv = <div className="ScheduleWeek-Reps"><p className="ScheduleWeek-Reps-Content">{workout.reps}</p></div>;
            var weightDiv = <div className="ScheduleWeek-Weight"><p className="ScheduleWeek-Weight-Content">{workout.weight}</p></div>;
            var timeOnDiv = <div className="ScheduleWeek-TimeOn"><p className="ScheduleWeek-TimeOn-Content">{this.formatTime(workout.time_on_minute, workout.time_on_second)}</p></div>;
            var timeOffDiv = <div className="ScheduleWeek-TimeOff"><p className="ScheduleWeek-TimeOff-Content">{this.formatTime(workout.rest_minute, workout.rest_second)}</p></div>;
            var frequencyDiv = <div className="ScheduleWeek-Frequency"><p className="ScheduleWeek-Frequency-Content">{workout.component.title}</p></div>;
        }

        /*var typeP = document.createElement("p");
        var thrP = document.createElement("p");
        var maxP = document.createElement("p");
        var setsP = document.createElement("p");
        var repsP = document.createElement("p");
        var weightP = document.createElement("p");
        var timeOnP = document.createElement("p");
        var timeOffP = document.createElement("p");
        var frequencyP = document.createElement("p");*/

        /*typeDiv.classList.add("ScheduleWeek-Type");
        thrDiv.classList.add("ScheduleWeek-THR");
        maxDiv.classList.add("ScheduleWeek-Max");
        setsDiv.classList.add("ScheduleWeek-Sets");
        repsDiv.classList.add("ScheduleWeek-Reps");
        weightDiv.classList.add("ScheduleWeek-Weight");
        timeOnDiv.classList.add("ScheduleWeek-TimeOn");
        timeOffDiv.classList.add("ScheduleWeek-TimeOff");
        frequencyDiv.classList.add("ScheduleWeek-Frequency");

        typeP.classList.add("ScheduleWeek-Type-Content");
        thrP.classList.add("ScheduleWeek-THR-Content");
        maxP.classList.add("ScheduleWeek-Max-Content");
        setsP.classList.add("ScheduleWeek-Sets-Content");
        repsP.classList.add("ScheduleWeek-Reps-Content");
        weightP.classList.add("ScheduleWeek-Weight-Content");
        timeOnP.classList.add("ScheduleWeek-TimeOn-Content");
        timeOffP.classList.add("ScheduleWeek-TimeOff-Content");
        frequencyP.classList.add("ScheduleWeek-Frequency-Content");

        typeP.textContent = workout.exercise.title;
        thrP.textContent = workout.target_heart_rate;
        maxP.textContent = "MAX%";
        setsP.textContent = workout.sets;
        repsP.textContent = workout.reps;
        weightP.textContent = workout.weight;
        timeOnP.textContent = this.formatTime(workout.time_on_minute, workout.timne_on_second);
        timeOffP.textContent = this.formatTime(workout.time_off_minute, workout.timne_off_second);
        frequencyP.textContent = workout.frequency;

        typeDiv.appendChild(typeP);
        thrDiv.appendChild(thrP);
        maxDiv.appendChild(maxP);
        setsDiv.appendChild(setsP);
        repsDiv.appendChild(repsP);
        weightDiv.appendChild(weightP);
        timeOnDiv.appendChild(timeOnP);
        timeOffDiv.appendChild(timeOffP);
        frequencyDiv.appendChild(frequencyP);*/

        /*elements.push(typeP);
        elements.push(thrP);
        elements.push(maxP);
        elements.push(setsP);
        elements.push(repsP);
        elements.push(weightP);
        elements.push(timeOnP);
        elements.push(timeOffP);
        elements.push(frequencyP);

        contentWrapper.appendChild(typeDiv);
        contentWrapper.appendChild(thrDiv);
        contentWrapper.appendChild(maxDiv);
        contentWrapper.appendChild(setsDiv);
        contentWrapper.appendChild(repsDiv);
        contentWrapper.appendChild(weightDiv);
        contentWrapper.appendChild(timeOnDiv);
        contentWrapper.appendChild(timeOffDiv);
        contentWrapper.appendChild(frequencyDiv);*/

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

    formatTime(minuteValue, secondValue){
        return minuteValue + "m " + secondValue + "s";
    }

    changeListItemBackground(event){
        if(this.state.index !== 0){
            document.getElementById("ScheduleWeek-Row-Content-Wrapper-" + this.state.day + "-" + this.state.count).style.background = "#ffbb00";
        }
    }

    returnListItemBackground(event){
        if(this.state.index !== 0){
            if(this.state.count % 2 === 0){
                document.getElementById("ScheduleWeek-Row-Content-Wrapper-" + this.state.day + "-" + this.state.count).style.background = "#aa7d00";
            }else{
                document.getElementById("ScheduleWeek-Row-Content-Wrapper-" + this.state.day + "-" + this.state.count).style.background = "#daa000";
            }
        }
        //this.recolorRows(goalList);

        /*var num = id.split("-")[1];
        var backgroundColor = (parseInt(num) % 2 === 0 ? "#c08d00" : "#997000");

        document.getElementById(id).style.background = backgroundColor;*/
    }

    //Render the Header component to the DOM/Screen
    render(){

        //var dayOfWeek = (this.props.dayOfWeek.localeCompare("Title") === 0 ? "" : this.props.dayOfWeek);
        var h = (this.props.index === 0 ? "100%" : "50%");

        console.log(this.props.count);

        var backColor = (this.props.index === 0 ? "#b98800" : (this.props.count % 2 === 0 ? "#aa7d00" : " #daa000"));

        return(

                <div className="ScheduleWeek-Row-Content-Wrapper" id={"ScheduleWeek-Row-Content-Wrapper-" + this.props.day + "-" + this.props.count} style={{height: h, background: backColor}} onClick={e => this.onWorkoutClick(e)} onMouseEnter={e => this.changeListItemBackground(e)} onMouseLeave={e => this.returnListItemBackground(e)}>
                    {this.fillWorkoutContent(this.props.index)}
                </div>                 
                                
        );
            
    }
}

export default ScheduleWeekContent;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",

/*<div className="ScheduleWeek-Type">
                        <p className="ScheduleWeek-Type-Content"></p>
                    </div>
                    <div className="ScheduleWeek-THR">
                        <p className="ScheduleWeek-THR-Content"></p>
                    </div>
                    <div className="ScheduleWeek-Max">
                        <p className="ScheduleWeek-Max-Content"></p>
                    </div>
                    <div className="ScheduleWeek-Sets">
                        <p className="ScheduleWeek-Sets-Content"></p>
                    </div>
                    <div className="ScheduleWeek-Reps">
                        <p className="ScheduleWeek-Reps-Content"></p>
                    </div>
                    <div className="ScheduleWeek-Weight">
                        <p className="ScheduleWeek-Weight-Content"></p>
                    </div>
                    <div className="ScheduleWeek-TimeOn">
                        <p className="ScheduleWeek-TimeOn-Content"></p>
                    </div>
                    <div className="ScheduleWeek-TimeOff">
                        <p className="ScheduleWeek-TimeOff-Content"></p>
                    </div>
                    <div className="ScheduleWeek-Frequency">
                        <p className="ScheduleWeek-Frequency-Content"></p>
                    </div>                     {this.fillWorkoutContent()}*/
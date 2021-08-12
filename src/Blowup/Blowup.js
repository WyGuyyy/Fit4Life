import React, { Fragment } from 'react';
import {baseURI} from '../_services/APIService';
import {getStudentGradesForWeek} from '../_services/GradeService';
import ReactDom from 'react-dom';
import './Blowup.css';
import BlowupDay from './BlowupDay';

class Blowup extends React.Component{
    constructor(props){
        super(props);
   
        this.state = {

        };

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    async componentDidMount(){ 
        await this.fillWorkouts();
        this.fillWorkoutList();
    }

    componentDidUpdate(){
        this.fillWorkoutList();
    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
       
    }

    async fillWorkouts(){
        var workouts = [];
        var userID = (localStorage.getItem("userRole").localeCompare("STUDENT") === 0 ? localStorage.getItem("userID") : this.props.oStudent.user_id);

        //await fetch(baseURI + "/api/classroom", {
            await fetch(baseURI + "/api/workout/byuser/" + userID, {  
                method: "GET",                          
                headers: {"Content-Type": "application/json",
                          "Authorization": "Bearer " + localStorage.getItem("auth_token")}
            })
            .then(res => res.text())
            .then(
                (text) => {
                    var result = text.length ? JSON.parse(text) : {};
                    workouts = result;
                }
            ).catch(console.log);

            this.setState({
                workoutList: workouts
            });
    }

    fillWorkoutList(){

        var dayList = document.getElementsByClassName("Blowup-List")[0];
        //var elementArr = [];

        var child = dayList.lastElementChild; 
        while (child) {
            dayList.removeChild(child);
            child = dayList.lastElementChild;
        }
        
        var workouts = this.state.workoutList;

        if(workouts === undefined){
            return;
        }

        var formattedDate = this.formatDateForDay();

        for(var count = 0; count < workouts.length; count++){

            var workout = workouts[count];

            if(workout.date === formattedDate){
                console.log(count);
                var workoutWrapper = document.createElement("div");
                workoutWrapper.classList.add("Blowup-Workout-Wrapper");

                if(count % 2 == 0){
                    workoutWrapper.style.background = "#aa7d00";
                }else{
                    workoutWrapper.style.background = "#daa000";
                }

                //var workoutWrapper = <div className="Blowup-Workout-Wrapper">{this.createColumns(workout)}</div>;

                var typeDiv = document.createElement("div");
                var typeP = document.createElement("p");
                
                typeP.classList.add("Blowup-Type-Content");
                typeP.classList.add("Blowup-Text");
                typeP.textContent = workout.exercise.title;

                typeDiv.classList.add("Blowup-Type-Wrapper");
                typeDiv.appendChild(typeP);

                var thrDiv = document.createElement("div");
                var thrP = document.createElement("p");

                thrP.classList.add("Blowup-THR-Content");
                thrP.classList.add("Blowup-Text");
                thrP.textContent = workout.target_heart_rate.localeCompare("None") === 0 ? "" : workout.target_heart_rate;

                thrDiv.classList.add("Blowup-THR-Wrapper");
                thrDiv.appendChild(thrP);

                var maxDiv = document.createElement("div");
                var maxP = document.createElement("p");

                maxP.classList.add("Blowup-Max-Content");
                maxP.classList.add("Blowup-Text");
                maxP.textContent = workout.max === -1 ? "" : workout.max + "%";

                maxDiv.classList.add("Blowup-Max-Wrapper");
                maxDiv.appendChild(maxP);
                
                var setsDiv = document.createElement("div");
                var setsP = document.createElement("p");

                setsP.classList.add("Blowup-Sets-Content");
                setsP.classList.add("Blowup-Text");
                setsP.textContent = (workout.sets === -1 ? "" : workout.sets + " sets");

                setsDiv.classList.add("Blowup-Sets-Wrapper");
                setsDiv.appendChild(setsP);

                var repsDiv = document.createElement("div");
                var repsP = document.createElement("p");

                repsP.classList.add("Blowup-Reps-Content");
                repsP.classList.add("Blowup-Text");
                repsP.textContent = (workout.reps === -1 ? "" : workout.reps + " reps");

                repsDiv.classList.add("Blowup-Reps-Wrapper");
                repsDiv.appendChild(repsP);

                var weightDiv = document.createElement("div");
                var weightP = document.createElement("p");

                weightP.classList.add("Blowup-Weight-Content");
                weightP.classList.add("Blowup-Text");
                weightP.textContent = (workout.weight === -1 ? "" : workout.weight + " lb");

                weightDiv.classList.add("Blowup-Weight-Wrapper");
                weightDiv.appendChild(weightP);

                var timeOnDiv = document.createElement("div");
                var timeOnP = document.createElement("p");

                timeOnP.classList.add("Blowup-TimeOn-Content");
                timeOnP.classList.add("Blowup-Text");
                timeOnP.textContent = this.formatTime(workout.time_on_minute, workout.time_on_second);

                timeOnDiv.classList.add("Blowup-TimeOn-Wrapper");
                timeOnDiv.appendChild(timeOnP);

                var timeOffDiv = document.createElement("div");
                var timeOffP = document.createElement("p");

                timeOffP.classList.add("Blowup-TimeOff-Content");
                timeOffP.classList.add("Blowup-Text");
                timeOffP.textContent = this.formatTime(workout.rest_minute, workout.rest_second);

                timeOffDiv.classList.add("Blowup-TimeOff-Wrapper");
                timeOffDiv.appendChild(timeOffP);

                var frequencyDiv = document.createElement("div");
                var frequencyP = document.createElement("p");

                frequencyP.classList.add("Blowup-Frequency-Content");
                frequencyP.classList.add("Blowup-Text");
                frequencyP.textContent = this.getComponentString(workout.components);

                frequencyDiv.classList.add("Blowup-Frequency-Wrapper");
                frequencyDiv.appendChild(frequencyP);

                workoutWrapper.appendChild(typeDiv);
                workoutWrapper.appendChild(thrDiv);
                workoutWrapper.appendChild(maxDiv);
                workoutWrapper.appendChild(setsDiv);
                workoutWrapper.appendChild(repsDiv);
                workoutWrapper.appendChild(weightDiv);
                workoutWrapper.appendChild(timeOnDiv);
                workoutWrapper.appendChild(timeOffDiv);
                workoutWrapper.appendChild(frequencyDiv);
                
                /*var typeDiv = <div className="Blowup-Type"><p className="Blowup-Type-Content">{workout.exercise.title}</p></div>;
                var thrDiv = <div className="Blowup-THR"><p className="Blowup-THR-Content">{workout.target_heart_rate.localeCompare("None") === 0 ? "" : workout.target_heart_rate}</p></div>;
                
                
                var maxDiv = <div className="Blowup-Max"><p className="Blowup-Max-Content">{(workout.max === -1 ? "" : workout.max + "%")}</p></div>;


                var setsDiv = <div className="Blowup-Sets"><p className="Blowup-Sets-Content">{workout.sets === -1 ? "" : workout.sets}</p></div>;


                var repsDiv = <div className="Blowup-Reps"><p className="Blowup-Reps-Content">{workout.reps === -1 ? "" : workout.reps}</p></div>;


                var weightDiv = <div className="Blowup-Weight"><p className="Blowup-Weight-Content">{workout.weight === -1 ? "" : workout.weight}</p></div>;


                var timeOnDiv = <div className="Blowup-TimeOn"><p className="Blowup-TimeOn-Content">{this.formatTime(workout.time_on_minute, workout.time_on_second)}</p></div>;


                var timeOffDiv = <div className="Blowup-TimeOff"><p className="Blowup-TimeOff-Content">{this.formatTime(workout.rest_minute, workout.rest_second)}</p></div>;


                var frequencyDiv = <div className="Blowup-Frequency">{this.getComponentString(workout.components)}</div>;*/

                //elementArr.push(workoutWrapper);
                
                dayList.appendChild(workoutWrapper);
            }

        }
        //return elementArr;
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
            compStringArr.push(compArr[count].title);
        }

        return compStringArr;
    }

    formatDateForDay(){
        var dayOfWeek = this.props.dayOfWeek;
        var dateArr = this.props.date.split("-");
        var dateFormatted = dateArr[1] + "/" + dateArr[2] + "/" + dateArr[0];
        var startOfWeek = new Date(dateFormatted);
        var currentDate;

        if(dayOfWeek.localeCompare("Monday") === 0){
            startOfWeek = startOfWeek;
        }else if(dayOfWeek.localeCompare("Tuesday") === 0){
            startOfWeek.setDate(startOfWeek.getDate() + 1);
        }else if(dayOfWeek.localeCompare("Wednesday") === 0){
            startOfWeek.setDate(startOfWeek.getDate() + 2);
        }else if(dayOfWeek.localeCompare("Thursday") === 0){
            startOfWeek.setDate(startOfWeek.getDate() + 3);
        }else if(dayOfWeek.localeCompare("Friday") === 0){
            startOfWeek.setDate(startOfWeek.getDate() + 4);
        }

        var strYear = startOfWeek.getFullYear();
        var strMonth = (startOfWeek.getMonth() <= 9 ? "0" + (startOfWeek.getMonth() + 1) : startOfWeek.getMonth() + 1);
        var strDate = (startOfWeek.getDate() <= 9 ? "0" + startOfWeek.getDate() : startOfWeek.getDate());

        currentDate = strYear + "-" + strMonth + "-" + strDate;

        return currentDate;

    }

    /*createColumns(workout){

        var elementArr = [];

        var typeDiv = <div className="Blowup-Type"><p className="Blowup-Type-Content">{workout.exercise.title}</p></div>;
        var thrDiv = <div className="Blowup-THR"><p className="Blowup-THR-Content">{workout.target_heart_rate.localeCompare("None") === 0 ? "" : workout.target_heart_rate}</p></div>;

        var maxDiv = <div className="Blowup-Max"><p className="Blowup-Max-Content">{(workout.max === -1 ? "" : workout.max + "%")}</p></div>;
        var setsDiv = <div className="Blowup-Sets"><p className="Blowup-Sets-Content">{workout.sets === -1 ? "" : workout.sets}</p></div>;
        var repsDiv = <div className="Blowup-Reps"><p className="Blowup-Reps-Content">{workout.reps === -1 ? "" : workout.reps}</p></div>;
        var weightDiv = <div className="Blowup-Weight"><p className="Blowup-Weight-Content">{workout.weight === -1 ? "" : workout.weight}</p></div>;
        var timeOnDiv = <div className="Blowup-TimeOn"><p className="Blowup-TimeOn-Content">{this.formatTime(workout.time_on_minute, workout.time_on_second)}</p></div>;
        var timeOffDiv = <div className="Blowup-TimeOff"><p className="Blowup-TimeOff-Content">{this.formatTime(workout.rest_minute, workout.rest_second)}</p></div>;
        var frequencyDiv = <div className="Blowup-Frequency">{this.getComponentString(workout.components)}</div>;

        elementArr.push(typeDiv);
        elementArr.push(thrDiv);
        elementArr.push(maxDiv);
        elementArr.push(setsDiv);
        elementArr.push(repsDiv);
        elementArr.push(weightDiv);
        elementArr.push(timeOnDiv);
        elementArr.push(timeOffDiv);
        elementArr.push(frequencyDiv);

        return elementArr;

    }*/

    formatTime(minuteValue, secondValue){

        if(minuteValue === -1 && secondValue === -1){
            return "";
        }

        return this.returnNonNegativeValue(minuteValue) + "m " + this.returnNonNegativeValue(secondValue) + "s";
    }

    returnNonNegativeValue(value){
        return value === -1 ? 0 : value;
    }

    onCloseBlowup(event){
        var blowup = document.getElementsByClassName("Blowup-Container")[0];
        blowup.style.display = "none";
    }

    //Render the Header component to the DOM/Screen
    render(){

        var studentName = this.props.student;

        var aDate = this.props.date;
        var aClassroom = this.props.classroom;

        var classroomTitle = aClassroom.title;

        var aStudent = this.props.oStudent;

            return(

                    <div className="Blowup-Container">
                        <div className="Blowup-Wrapper">
                            <div className="Blowup-Title-Area">
                                <div className="Blowup-Exit" onClick={e => this.onCloseBlowup(e)}>X</div>
                                <div className="Blowup-Title-Date-Area">
                                    <h1 className="Blowup-DayOfWeek">{this.props.dayOfWeek}</h1>
                                    <h1 className="Blowup-Date">{this.props.date}</h1>
                                </div>
                                <div className="Blowup-Title-Classroom-Area">
                                    <h1 className="Blowup-Classroom">{classroomTitle}</h1>
                                </div>
                                <div className="Blowup-Title-Name-Area">
                                    <h1 className="Blowup-Name">{studentName}</h1>
                                </div>
                            </div>
                            <div className="Blowup-Table-Wrapper">
                            <div className="Blowup-Column-Titles-Area">
                                    <div className="Blowup-Type" >
                                        <p className="Blowup-Type-Content" id="exerciseTitle">{"Exercise"}</p>
                                    </div>
                                    <div className="Blowup-THR" >
                                        <p className="Blowup-THR-Content" id="thrTitle">{"THR"}</p>
                                    </div>
                                    <div className="Blowup-Max" >
                                        <p className="Blowup-Max-Content" id="maxTitle">{"Max %"}</p>
                                    </div>
                                    <div className="Blowup-Sets" >
                                        <p className="Blowup-Sets-Content" id="setsTitle">{"Sets"}</p>
                                    </div>
                                    <div className="Blowup-Reps" >
                                        <p className="Blowup-Reps-Content" id="repsTitle">{"Reps"}</p>
                                    </div>
                                    <div className="Blowup-Weight" >
                                        <p className="Blowup-Weight-Content" id="weightTitle">{"Weight"}</p>
                                    </div>
                                    <div className="Blowup-TimeOn" >
                                        <p className="Blowup-TimeOn-Content" id="timeOnTitle">{"Time On"}</p>
                                    </div>
                                    <div className="Blowup-TimeOff" >
                                        <p className="Blowup-TimeOff-Content" id="timeOffTitle">{"Time Off"}</p>
                                    </div>
                                    <div className="Blowup-Frequency" >
                                        <p className="Blowup-Frequency-Content" id="componentTitle">{"Component"}</p>
                                    </div>
                                </div>
                                
                                <div className="Blowup-List">

                                </div>
                            </div>
                        </div>
                    </div>

            );
            
    }

}

export default Blowup;

//<BlowupDay height="100%" dayOfWeek={this.props.dayOfWeek} date={aDate} classroom={aClassroom} student={aStudent} />
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
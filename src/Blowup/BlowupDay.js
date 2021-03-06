import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './BlowupDay.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout'
import BlowupDayContent from './BlowupDayContent';
import { Link } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete, MdStayCurrentPortrait } from 'react-icons/md';
import {baseURI} from '../_services/APIService';

class BlowupDay extends React.Component{
    
     count = 0;

    constructor(props){
        super(props);

        this.state = {
            cellHeight: props.height,
            dayOfWeek: props.dayOfWeek,
            userID: props.userID,
            currWorkoutCount: -1,
            onWorkoutClick: props.onWorkoutClick,
            history: props.history,
            date: props.date,
            classroom: props.classroom,
            userWorkouts: []
        };

        this.fillWorkouts();
    }
    
    /*checkGrid(){

        if(window.innerWidth < 580){
            document.getElementById("ScheduleWeek-Day-Content-Monday").textContent = "M";
            document.getElementById("ScheduleWeek-Day-Content-Tuesday").textContent = "T";
            document.getElementById("ScheduleWeek-Day-Content-Wednesday").textContent = "W";
            document.getElementById("ScheduleWeek-Day-Content-Thursday").textContent = "TR";
            document.getElementById("ScheduleWeek-Day-Content-Friday").textContent = "F";
        }else{
            document.getElementById("ScheduleWeek-Day-Content-Monday").textContent = "Monday";
            document.getElementById("ScheduleWeek-Day-Content-Tuesday").textContent = "Tuesday";
            document.getElementById("ScheduleWeek-Day-Content-Wednesday").textContent = "Wednesday";
            document.getElementById("ScheduleWeek-Day-Content-Thursday").textContent = "Thursday";
            document.getElementById("ScheduleWeek-Day-Content-Friday").textContent = "Friday";
        }

    }*/

    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
        
    }

    componentDidUpdate(){
        
    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    async fillWorkouts(){
        
        var workouts = [];
        var userID = (localStorage.getItem("userRole").localeCompare("STUDENT") === 0 ? localStorage.getItem("userID") : this.props.student.user_id);

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
                userWorkouts: workouts
            });

            /*this.setState({
                userWorkouts: workouts
            }, this.fillSchedule(this, workouts));*/
    }

    fillSchedule(){

        var wrapArrIndex = this.getWeekWrapper(this.props.dayOfWeek);
        var count = 0;
        var weekWrapperArr = document.getElementsByClassName("BlowupDay-Row-Wrapper");
        var weekWrapper = weekWrapperArr[wrapArrIndex];
        var aFlexColumn;
        var workouts = this.state.userWorkouts;
        var count = 0;
        
        if(wrapArrIndex === 0){;
            var content = <div className="BlowupDay-Content-Wrapper">{this.renderDay([{title: "Title Row"}])}</div>
        }else{
              
            var content = <div className="BlowupDay-Content-Wrapper">{this.renderDay(workouts)}</div>
                
        }

        var elArr = [];
        elArr.push(content);

        return elArr;

    }

    renderDay(workouts){

        var aCount = 0;
        var matchCount = 0;
        var elementArr = [];

        if(workouts[0] === null || workouts[0] === undefined || workouts[0] === {}){
            return elementArr;
        }

        for(aCount = 0; aCount < workouts.length; aCount++){
            if(workouts !== [] ){
                if(workouts[0].title){
                    var el = <BlowupDayContent workout={workouts} index={this.getWeekWrapper(this.state.dayOfWeek)} day={this.state.dayOfWeek} count={aCount} onWorkoutClick={this.state.onWorkoutClick} history={this.state.history} eventToRemove={this.state.eventToRemove}/>;
                    elementArr.push(el);
                    break;

                }else{
                    if(this.matchesFilters(workouts[aCount])){
                        var el = <BlowupDayContent workout={workouts[aCount]} index={this.getWeekWrapper(this.state.dayOfWeek)} day={this.state.dayOfWeek} count={matchCount} onWorkoutClick={this.state.onWorkoutClick} history={this.state.history} eventToRemove={this.state.eventToRemove}/>;
                        elementArr.push(el);
                        matchCount++;
                    }
                }
            }
        }

        return elementArr;
    }

    matchesFilters(workout){
        var strDate = workout.date.split("T")[0];
        var strDateForDay = this.formatDateForDay();
 
        if(workout.classroom.classroom_id === this.props.classroom.classroom_id && 
            strDate.localeCompare(strDateForDay) === 0){
                return true;
            }else{
                return false;
            }
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

    getWeekWrapper(dayOfWeek){
        
        if(dayOfWeek.localeCompare("Monday") === 0){
            return 1;
        }else if(dayOfWeek.localeCompare("Tuesday") === 0){
            return 2;
        }else if(dayOfWeek.localeCompare("Wednesday") === 0){
            return 3;
        }else if(dayOfWeek.localeCompare("Thursday") === 0){
            return 4;
        }else if(dayOfWeek.localeCompare("Friday") === 0){
            return 5;
        }else{
            return 0;
        }
        
        /*switch(dayOfWeek){
            case "Monday":
                return 0;
            case "Tuesday":
                return 1;
            case "Wednesday":
                return 2;
            case "Thursday":
                return 3;
            case "Friday":
                return 4;
            default:
                return -1;
        }*/
    }

    fitDayString(dayOfWeek){

        if(dayOfWeek.localeCompare("Monday") === 0){
            return (window.innerWidth < 700 ? "M" : "Monday");
        }else if(dayOfWeek.localeCompare("Tuesday") === 0){
            return (window.innerWidth < 700 ? "T" : "Tuesday");
        }else if(dayOfWeek.localeCompare("Wednesday") === 0){
            return (window.innerWidth < 700 ? "W" : "Wednesday");
        }else if(dayOfWeek.localeCompare("Thursday") === 0){
            return (window.innerWidth < 700 ? "TR" : "Thursday");
        }else if(dayOfWeek.localeCompare("Friday") === 0){
            return (window.innerWidth < 700 ? "F" : "Friday");
        }else{
            return "Day";
        }
    }

    /*onDayClick(event){
        var day = event.target.id.split("-")[2];
        var dayContainer = document.getElementsByClassName("Schedule-Grid-Chart-" + day)[0];
    }*/

    //Render the Header component to the DOM/Screen
    render(){

        /*if(!(this.state.userWorkouts === [])){
            this.fillSchedule(this, this.state.userWorkouts);
        }*/

        var dayOfWeek = (this.props.dayOfWeek.localeCompare("Title") === 0 ? "Day" : this.props.dayOfWeek);

        var aID = "Blowup-Day-Content-" + dayOfWeek;
        var day = this.fitDayString(dayOfWeek);

        return(

            <div className="BlowupDay-Row-Wrapper" style={{height: this.state.cellHeight}}>
                {this.fillSchedule()}
            </div>                    
                                
        );
            
    }
}

export default BlowupDay;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
//<p className="ScheduleWeek-Day-Content" id={aID}>{this}</p>
//{this.fillSchedule()}
/*
                <div className="BlowupDay-Day" id={"Blowup-Day-" + this.props.dayOfWeek} onClick={this.props.customClick}>
                    <p className="Blowup-Day-Content" id={aID}>{this.fitDayString(dayOfWeek)}</p>
                </div>
*/
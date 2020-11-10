import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './ScheduleWeek.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout'
import ScheduleWeekContent from './ScheduleWeekContent';
import { Link } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete, MdStayCurrentPortrait } from 'react-icons/md';

class ScheduleWeek extends React.Component{
    
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
       //window.addEventListener("resize", this.checkGrid.bind(this));
        console.log(props.classroom);
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
        console.log(this.props);
        var userID = (localStorage.getItem("userRole").localeCompare("STUDENT") === 0 ? localStorage.getItem("userID") : this.props.student.user_id);

        //await fetch("http://192.168.1.5:8080/api/classroom", {
            await fetch("http://localhost:8080/api/workout/byuser/" + userID, {  
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

            console.log(workouts);

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
        var weekWrapperArr = document.getElementsByClassName("ScheduleWeek-Row-Wrapper");
        var weekWrapper = weekWrapperArr[wrapArrIndex];
        var aFlexColumn;
        var workouts = this.state.userWorkouts;
        var count = 0;
    
        //weekWrapper.innerHTML = '';

        //var day = document.createElement("div");
        //day.classList.add("ScheduleWeek-Day");

        //var dayP = document.createElement("p");
        //dayP.classList.add("ScheduleWeek-Day-Content");
       // dayP.textContent = (this.props.dayOfWeek.localeCompare("Title") === 0 ? "Day" : this.props.dayOfWeek);
        //dayP.textContent = this.fitDayString(this.props.dayOfWeek);

        //day.appendChild(dayP);
        //weekWrapper.appendChild(day);

        //aFlexColumn = document.createElement('div');
        //aFlexColumn.className = "ScheduleWeek-Content-Wrapper";
        console.log(workouts);
        
            if(wrapArrIndex === 0){;
                var content = <div className="ScheduleWeek-Content-Wrapper">{this.renderDay([{title: "Title Row"}])}</div>
            }else{
                
                var content = <div className="ScheduleWeek-Content-Wrapper">{this.renderDay(workouts)}</div>
                
            }

        /*if(wrapArrIndex === 0){
            //var content = <div className="ScheduleWeek-Content-Wrapper"></div>;
            //ReactDom.render(this.renderDay([{title: "Title Row"}], this), aFlexColumn);
            var content = <div className="ScheduleWeek-Content-Wrapper">{this.renderDay([{title: "Title Row"}])}</div>
        }else{
            //var content = <div className="ScheduleWeek-Content-Wrapper"></div>;
            //ReactDom.render(this.renderDay(workouts), aFlexColumn);
            //console.log(this.state.userWorkouts);
            var content = <div className="ScheduleWeek-Content-Wrapper">{this.renderDay(workouts)}</div>
        }*/

        var elArr = [];
        elArr.push(content);

        console.log(elArr);

        return elArr;

        //weekWrapper.appendChild(aFlexColumn);

        //var arr = [];
        //arr.push(content);

        //return arr;

        //return aFlexColumn;

        //weekWrapper.appendChild(aFlexColumn);

        /*for(countOuter = 0; countOuter < numRows; countOuter++){
            
            aFlexColumn = document.createElement('div');
            aFlexColumn.className = "ScheduleWeek-Content-Wrapper";

            for(countInner = 0; countInner < tilesPerRow; countInner++){

                aTile = ReactDom.render(this.renderDay(workouts), aFlexColumn);
                //ReactDOM.render(aTile, aFlexRow);
            }

            
        }*/

    }

    renderDay(workouts){

        var aCount = 0;
        var elementArr = [];

        for(aCount = 0; aCount < workouts.length; aCount++){
            if(workouts !== [] ){
                if(workouts[0].title){

                    var el = <ScheduleWeekContent workout={workouts} index={this.getWeekWrapper(this.state.dayOfWeek)} day={this.state.dayOfWeek} count={aCount} onWorkoutClick={this.state.onWorkoutClick} history={this.state.history} eventToRemove={this.state.eventToRemove}/>;
                    elementArr.push(el);
                    break;

                }else{
            
                    if(this.matchesFilters(workouts[aCount])){
                        var el = <ScheduleWeekContent workout={workouts[aCount]} index={this.getWeekWrapper(this.state.dayOfWeek)} day={this.state.dayOfWeek} count={aCount} onWorkoutClick={this.state.onWorkoutClick} history={this.state.history} eventToRemove={this.state.eventToRemove}/>;
                        elementArr.push(el);
                    }
                }
            }
        }

        return elementArr;
    }

    matchesFilters(workout){
        var strDate = workout.date.split("T")[0];
        var strDateForDay = this.formatDateForDay();

        console.log(strDateForDay + " " + strDate);
 
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
        var strMonth = (startOfWeek.getMonth() < 9 ? "0" + (startOfWeek.getMonth() + 1) : startOfWeek.getMonth() + 1);
        var strDate = (startOfWeek.getDate() < 9 ? "0" + startOfWeek.getDate() : startOfWeek.getDate());

        currentDate = strYear + "-" + strMonth + "-" + strDate;

        return currentDate;

    }

   /* renderDay(workouts){

        var count = 1;

        if(workouts !== [] ){
            return workouts.map(this.renderDayItem.bind(this, count));
        }
    }*/

   /* renderDayItem(aContext, currWorkout){

        console.log(aContext);

        if(!(currWorkout.title)){
            if(!(currWorkout.classroom.classroom_id === this.props.date)){
                return;
            }
        }*/

        

        /*var newWC = aContext.state.currWorkoutCount + 1;
        aContext.setState({
            currWorkoutCount: newWC
        });*/

 /*       return <ScheduleWeekContent workout={currWorkout} index={this.getWeekWrapper(this.state.dayOfWeek)} day={this.state.dayOfWeek} count={aContext} onWorkoutClick={this.state.onWorkoutClick} history={this.state.history} eventToRemove={this.state.eventToRemove}/>
    }*/

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

    //Render the Header component to the DOM/Screen
    render(){

        /*if(!(this.state.userWorkouts === [])){
            this.fillSchedule(this, this.state.userWorkouts);
        }*/

        var dayOfWeek = (this.props.dayOfWeek.localeCompare("Title") === 0 ? "Day" : this.props.dayOfWeek);

        /*console.log(this.props.dayOfWeek.localeCompare("Title") === 0);
        console.log("ScheduleWeek-Day-Content-" + dayOfWeek);*/

        var aID = "ScheduleWeek-Day-Content-" + dayOfWeek;
        var day = this.fitDayString(dayOfWeek);

        return(

            <div className="ScheduleWeek-Row-Wrapper" style={{height: this.state.cellHeight}}>
                <div className="ScheduleWeek-Day">
                    <p className="ScheduleWeek-Day-Content" id={aID}>{this.fitDayString(dayOfWeek)}</p>
                </div>
                {this.fillSchedule()}
            </div>                    
                                
        );
            
    }
}

export default ScheduleWeek;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
//<p className="ScheduleWeek-Day-Content" id={aID}>{this}</p>
//{this.fillSchedule()}
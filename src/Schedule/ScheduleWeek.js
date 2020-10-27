import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './ScheduleWeek.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout'
import ScheduleWeekContent from './ScheduleWeekContent';
import { Link } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

class ScheduleWeek extends React.Component{
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
            classroom: props.classroom
        };
       //window.addEventListener("resize", this.checkGrid.bind(this));

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
        this.fillSchedule();
    }

    componentDidUpdate(){
        
    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    async fillSchedule(){

        var wrapArrIndex = this.getWeekWrapper(this.props.dayOfWeek);
        var workouts;
        var count = 0;
        var weekWrapperArr = document.getElementsByClassName("ScheduleWeek-Row-Wrapper");
        var weekWrapper = weekWrapperArr[wrapArrIndex];
        var aFlexColumn;

        var userID = this.props.userID;

        //await fetch("http://192.168.1.5:8080/api/classroom", {
        await fetch("http://localhost:8080/api/workout/byuser/" + 1, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                workouts = result;
            }
        ).catch(console.log);

        //weekWrapper.innerHTML = '';

        //var day = document.createElement("div");
        //day.classList.add("ScheduleWeek-Day");

        //var dayP = document.createElement("p");
        //dayP.classList.add("ScheduleWeek-Day-Content");
       // dayP.textContent = (this.props.dayOfWeek.localeCompare("Title") === 0 ? "Day" : this.props.dayOfWeek);
        //dayP.textContent = this.fitDayString(this.props.dayOfWeek);

        //day.appendChild(dayP);
        //weekWrapper.appendChild(day);

        aFlexColumn = document.createElement('div');
        aFlexColumn.className = "ScheduleWeek-Content-Wrapper";

        if(wrapArrIndex === 0){
            //ReactDom.render(this.renderDay([{title: "Title Row"}]), aFlexColumn);
            var content = <div className="ScheduleWeek-Content-Wrapper">{this.renderDay([{title: "Title Row"}])}</div>
        }else{
            //ReactDom.render(this.renderDay(workouts), aFlexColumn);
            var content = <div className="ScheduleWeek-Content-Wrapper">{this.renderDay(workouts)}</div>
        }

        //weekWrapper.appendChild(aFlexColumn);

        var arr = [];
        arr.push(content);

        return arr;

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
        console.log(workouts);
        return workouts.map(this.renderDayItem.bind(this));
    }

    renderDayItem(currWorkout){

        var newWC = this.state.currWorkoutCount + 1;
        this.setState({
            currWorkoutCount: newWC
        });

        console.log(this.state.classroom);

        return <ScheduleWeekContent workout={currWorkout} index={this.getWeekWrapper(this.state.dayOfWeek)} day={this.state.dayOfWeek} count={newWC} onWorkoutClick={this.state.onWorkoutClick} history={this.state.history} eventToRemove={this.state.eventToRemove}/>
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
        console.log((window.innerWidth < 700 ? "M" : "Monday"));
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
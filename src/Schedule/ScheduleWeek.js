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
            userID: props.userID
        };

    }
    
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

        weekWrapper.innerHTML = '';

        var day = document.createElement("div");
        day.classList.add("ScheduleWeek-Day");

        var dayP = document.createElement("p");
        dayP.classList.add("ScheduleWeek-Day-Content");
        dayP.textContent = this.props.dayOfWeek;

        day.appendChild(dayP);
        weekWrapper.appendChild(day);

        aFlexColumn = document.createElement('div');
        aFlexColumn.className = "ScheduleWeek-Content-Wrapper";

        for(count = 0; count < workouts.length; count++){

            ReactDom.render(this.renderDay(workouts), aFlexColumn);

        }

        weekWrapper.appendChild(aFlexColumn);

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
        return workouts.map(this.renderDayItem.bind(this));
    }

    renderDayItem(currWorkout){
        return <ScheduleWeekContent workout={currWorkout} />
    }

    getWeekWrapper(dayOfWeek){
        
        if(dayOfWeek.localeCompare("Monday") === 0){
            console.log("0");
            return 1;
        }else if(dayOfWeek.localeCompare("Tuesday") === 0){
            console.log("0");
            return 2;
        }else if(dayOfWeek.localeCompare("Wednesday") === 0){
            console.log("0");
            return 3;
        }else if(dayOfWeek.localeCompare("Thursday") === 0){
            console.log("0");
            return 4;
        }else if(dayOfWeek.localeCompare("Friday") === 0){
            console.log("0");
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

    //Render the Header component to the DOM/Screen
    render(){

        var dayOfWeek = (this.props.dayOfWeek.localeCompare("Title") === 0 ? "" : this.props.dayOfWeek);

        return(

            <div className="ScheduleWeek-Row-Wrapper" style={{height: this.state.cellHeight}}>
                    <div className="ScheduleWeek-Day">
                        <p className="ScheduleWeek-Day-Content">{dayOfWeek}</p>
                    </div>
            </div>                    
                                
        );
            
    }
}

export default ScheduleWeek;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
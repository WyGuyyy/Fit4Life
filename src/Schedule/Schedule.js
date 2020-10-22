import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './Schedule.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout';
import ScheduleWeek from './ScheduleWeek';
import { Link } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

class Schedule extends React.Component{
    constructor(props){
        super(props);

        this.state = {
           canGoBack: props.location.state.goBack
        };

        window.addEventListener("resize", this.checkGridTitles.bind(this));

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 

    }

    componentDidUpdate(){

    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    checkGridTitles(){
        if(window.innerWidth < 1024){
            //document.getElementById("dayTitle").textContent= "Day";
            document.getElementById("exerciseTitle").textContent = "Ex";
            document.getElementById("maxTitle").textContent = "Mx %";
            document.getElementById("thrTitle").textContent = "THR";
            document.getElementById("setsTitle").textContent = "St";
            document.getElementById("repsTitle").textContent = "Rp";
            document.getElementById("weightTitle").textContent = "Wt";
            document.getElementById("timeOnTitle").textContent = "On";
            document.getElementById("timeOffTitle").textContent = "Off";
            document.getElementById("componentTitle").textContent = "Cmp";
        }else{
            document.getElementById("exerciseTitle").textContent = "Exercise";
            document.getElementById("maxTitle").textContent = "Max %";
            document.getElementById("thrTitle").textContent = "THR";
            document.getElementById("setsTitle").textContent = "Sets";
            document.getElementById("repsTitle").textContent = "Reps";
            document.getElementById("weightTitle").textContent = "Weight";
            document.getElementById("timeOnTitle").textContent = "Time On";
            document.getElementById("timeOffTitle").textContent = "Time Off";
            document.getElementById("componentTitle").textContent = "Component";
        }

        if(window.innerWidth < 375){
            document.getElementById("Days-Categories-Title").textContent = "Days";
            document.getElementById("Intensity-Categories-Title").textContent = "Intensity";
            //document.getElementById("Frequency-Categories-Title").textContent = "Freq";
        }else{
            document.getElementById("Days-Categories-Title").textContent = "Days of the Week";
            document.getElementById("Intensity-Categories-Title").textContent = "Intensity";
            //document.getElementById("Frequency-Categories-Title").textContent = "Frequency";
        }

    }

    goBack(){ //This isnt working, start here next time
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }

    //Render the Header component to the DOM/Screen
    render(){

        return(
            <Fragment>
                <Header title="Schedule" breadCrumbs="Schedule" goBack={true} customClick={this.goBack.bind(this)}/>
                <div className="scheduleContainer">
                    <Popout />
                    <div className="scheduleWrapper" id="scheduleWrapper">

                        <div className="Schedule-Week-Selection-Wrapper">
                            <select className="Schedule-Week-Selection"></select>
                        </div>

                        <div className="scheduleGrid" id="scheduleGrid">

                            <div className="Schedule-Grid-Title">
                                <h1 className="Schedule-Grid-Title-Text">Physical Activity Log</h1>
                            </div>

                            <div className="Schedule-Grid-Categories">
                                <div className="Schedule-Grid-Categories-Days">
                                    <h2 className="Schedule-Grid-Categories-Title" id="Days-Categories-Title">Days of the Week</h2>
                                </div>
                                <div className="Schedule-Grid-Categories-Type">
                                    <h2 className="Schedule-Grid-Categories-Title" id="Type-Categories-Title">Type</h2>
                                    <p className="Schedule-Grid-Categories-Text">(What exercises or types of activity did you do?)</p>
                                </div>
                                <div className="Schedule-Grid-Categories-Intensity">
                                    <h2 className="Schedule-Grid-Categories-Title" id="Intensity-Categories-Title">Intensity</h2>
                                    <p className="Schedule-Grid-Categories-Text">(How hard was your workout? Did you do a certain number of reps or sets?)</p>
                                </div>
                                <div className="Schedule-Grid-Categories-Time">
                                    <h2 className="Schedule-Grid-Categories-Title" id="Time-Categories-Title">Time</h2>
                                    <p className="Schedule-Grid-Categories-Text">(How long did you work out for? Did you incorporate periods of rest?)</p>
                                </div>
                                <div className="Schedule-Grid-Categories-Frequency">
                                    <h2 className="Schedule-Grid-Categories-Title" id="Frequency-Categories-Title">Frequency</h2>
                                    <p className="Schedule-Grid-Categories-Text">(Which of the five fitness components did you do?)</p>
                                </div>
                            </div>

                            <div className="Schedule-Grid-Chart">
                                <div className="Schedule-Grid-Chart-Titles">
                                    <ScheduleWeek height="100%" dayOfWeek="Title" history={this.props.history}/>
                                </div>
                                <div className="Schedule-Grid-Chart-Monday">
                                    <ScheduleWeek height="100%" dayOfWeek="Monday" history={this.props.history}/>
                                </div>
                                <div className="Schedule-Grid-Chart-Tuesday">
                                    <ScheduleWeek height="100%" dayOfWeek="Tuesday" history={this.props.history}/>
                                </div>
                                <div className="Schedule-Grid-Chart-Wednesday">
                                    <ScheduleWeek height="100%" dayOfWeek="Wednesday" history={this.props.history}/>
                                </div>
                                <div className="Schedule-Grid-Chart-Thursday">
                                    <ScheduleWeek height="100%" dayOfWeek="Thursday" history={this.props.history}/>
                                </div>
                                <div className="Schedule-Grid-Chart-Friday">
                                    <ScheduleWeek height="100%" dayOfWeek="Friday" history={this.props.history}/>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default Schedule;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
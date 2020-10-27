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
           canGoBack: props.location.state.goBack,
           resizeTrigger: "",
           studentClassrooms: "",
           date: "",
           classroom: ""
        };

        window.addEventListener("resize", this.checkGridTitles.bind(this));

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
        this.fillClassroomSelect();
    }

    componentDidUpdate(){

    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    async fillClassroomSelect(){

        var classrooms;
        var classroom;

        await fetch("http://localhost:8080/api/classroom/foruser/" + 1, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                classrooms = result;
            }
        ).catch(console.log);

        var classSelect = document.getElementById("Workout-Classroom-Select");

        for(classroom in classrooms){
            console.log(classrooms[classroom]);
            classSelect.options[classSelect.options.length] = new Option(classrooms[classroom].title, classroom);
        }

        classSelect.selectedIndex = 0;

        this.setState({
            studentClassrooms: classrooms
        });

    }

    checkGridTitles(){

        if(document.getElementById("exerciseTitle")){

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

    this.setState({
        resizeTrigger: "go"
    });

    }

    dateChange(event){

        var dateInput = event.target;
        var date = new Date(dateInput.value);

        switch(date.getDay()){
            case 0:
                break;
            case 1:
                date.setDate(date.getDate() - 1);
                break;
            case 2:
                date.setDate(date.getDate() - 2);
                break;
            case 3:
                date.setDate(date.getDate() - 3);
                break;
            case 4:
                date.setDate(date.getDate() - 4);
                break;
            case 5:
                date.setDate(date.getDate() - 5);
                break;
            case 6:
                date.setDate(date.getDate() - 6);
                break;
            default:
                break;

        }

        var year = date.getFullYear();
        var month = this.formatMonth(date.getMonth() + 1);
        var day = this.formatDay(date.getDate() + 1);

        dateInput.value = year + "-" + month + "-" + day;

        this.setState({
            date: dateInput.value
        });
    }

    classChange(event){

        var classSelect = document.getElementById("Workout-Classroom-Select");
        var aClassroom = classSelect.options[classSelect.selectedIndex].text;
        
        this.setState({
            classroom: aClassroom
        });

    }

    formatMonth(month){

        if(parseInt(month) <  10){
            month = "0" + month;
        }

        return month;
    }

    formatDay(day){
        if(parseInt(day) <  10){
            day = "0" + day;
        }

        return day;
    }

    goBack(){ //This isnt working, start here next time
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }

    //Render the Header component to the DOM/Screen
    render(){

        var aDate = this.state.date;
        var aClassroom = (this.state.classroom.localeCompare("") === 0 ? this.state.studentClassrooms[0] : this.state.classroom);

        return(
            <Fragment>
                <Header title="Schedule" breadCrumbs="Schedule" goBack={true} customClick={this.goBack.bind(this)}/>
                <div className="scheduleContainer">
                    <Popout />
                    <div className="scheduleWrapper" id="scheduleWrapper">
                        
                        <div className="Schedule-Week-Filter-Wrapper">
                            <div className="Schedule-Week-Selection-Wrapper">
                                <h2 className="Workout-Input-Label">Week Of: </h2><input className="workoutInput" id="Workout-Input-Date" type="date" min="0" max="999" onChange={e => this.dateChange(e)}/>
                            </div>
                            <div className="Schedule-Week-Classroom-Wrapper">
                                <h2 className="Workout-Select-Classroom-Label">Classroom: </h2><select className="Workout-Classroom-Select" id="Workout-Classroom-Select" onChange={e => this.classChange(e)}></select>
                            </div>
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
                                    <ScheduleWeek height="100%" dayOfWeek="Title" history={this.props.history} date={aDate} classroom={aClassroom}/>
                                </div>
                                <div className="Schedule-Grid-Chart-Monday">
                                    <ScheduleWeek height="100%" dayOfWeek="Monday" history={this.props.history} eventToRemove={this.checkGridTitles.bind(this)} date={aDate} classroom={aClassroom}/>
                                </div>
                                <div className="Schedule-Grid-Chart-Tuesday">
                                    <ScheduleWeek height="100%" dayOfWeek="Tuesday" history={this.props.history} eventToRemove={this.checkGridTitles.bind(this)} date={aDate} classroom={aClassroom}/>
                                </div>
                                <div className="Schedule-Grid-Chart-Wednesday">
                                    <ScheduleWeek height="100%" dayOfWeek="Wednesday" history={this.props.history} eventToRemove={this.checkGridTitles.bind(this)} date={aDate} classroom={aClassroom}/>
                                </div>
                                <div className="Schedule-Grid-Chart-Thursday">
                                    <ScheduleWeek height="100%" dayOfWeek="Thursday" history={this.props.history} eventToRemove={this.checkGridTitles.bind(this)} date={aDate} classroom={aClassroom}/>
                                </div>
                                <div className="Schedule-Grid-Chart-Friday">
                                    <ScheduleWeek height="100%" dayOfWeek="Friday" history={this.props.history} eventToRemove={this.checkGridTitles.bind(this)} date={aDate} classroom={aClassroom}/>
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
//<select className="Schedule-Week-Selection"></select>
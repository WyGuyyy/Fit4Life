import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './Schedule.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout';
import ScheduleWeek from './ScheduleWeek';
import Grading from './Grading';
import Blowup from '../Blowup/Blowup';
import AdminHeader from '../Admin/AdminHeader/AdminHeader';
import AdminPopout from '../Admin/AdminPopout/AdminPopout';
import {getUserFullName} from '../_services/UserService';
import { Link, Redirect } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import {RedirectService} from '../_services/RedirectService';
import {getStudentGradesForWeek} from '../_services/GradeService';
import {baseURI} from '../_services/APIService';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import {authService} from '../_services/AuthenticationService';

class Schedule extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                canGoBack: props.location.state.goBack,
                resizeTrigger: "",
                studentClassrooms: "",
                date: "",
                classroom: "",
                classroomTitle: "",
                blowupDay: "",
                studentName: ""
            };
        }

        window.addEventListener("resize", this.checkGridTitles.bind(this));

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    async componentDidMount(){ 
        
        if(RedirectService.checkItemForUndefined(this.props.location.state)){
            this.fillClassroomSelect();
        }
        
        this.resetFilters();
        this.setScheduleName();

        authService.checkTokenValidity(this.props.history);
        
    }

    componentDidUpdate(){
            
    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    async setScheduleName(){

        var h2 = document.getElementsByClassName("Schedule-Grid-Title-Student")[0];

        if(localStorage.getItem("userRole") === "ADMIN"){
            var first = this.props.location.state.student.first_name;
            var last = this.props.location.state.student.last_name;

            h2.textContent = first + " " + last;
        }else{
            var data = await getUserFullName();

            h2.textContent = data.first + " " + data.last;
        }

        this.setState({
            studentName: h2.textContent
        });
    }

    async resetFilters(){

        if(localStorage.getItem("workoutClassroom") !== undefined && localStorage.getItem("workoutClassroom") !== null){
            document.getElementById("Workout-Classroom-Select").selected = localStorage.getItem("workoutClassroom");

            this.setState({
                classroomTitle: localStorage.getItem("workoutClassroom")
            });
        }

        if(localStorage.getItem("workoutDate") !== undefined && localStorage.getItem("workoutDate") !== null){
            document.getElementById("Workout-Input-Date").value = localStorage.getItem("workoutDate");

            this.setState({
                date: localStorage.getItem("workoutDate")
            });
        }

    }

    async fillClassroomSelect(){

        //document.getElementsByClassName("loaderBackground")[0].style.display = "flex";

        var classrooms = [];
        var classroom;

        var userID = (localStorage.getItem("userRole").localeCompare("STUDENT") === 0 ? localStorage.getItem("userID") : this.props.location.state.student.user_id);

        await fetch(baseURI + "/api/classroom/foruser/" + userID, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                classrooms = result;
            }
        ).catch(console.log);

        if(classrooms.length === 0){
            return;
        }

        if(localStorage.getItem("userRole") === "ADMIN"){
            for(var count = 0; count < classrooms.length; count++){
                if(!(classrooms[count].teacher.user_id === parseInt(localStorage.getItem("userID")))){
                    classrooms.splice(count, 1);
                }
            }
        }

        var classSelect = document.getElementById("Workout-Classroom-Select");

        for(classroom in classrooms){
            classSelect.options[classSelect.options.length] = new Option(classrooms[classroom].title, classrooms[classroom].classroom_id);
        }

        if(localStorage.getItem("workoutClassroom") === undefined || localStorage.getItem("workoutClassroom") === null){
            classSelect.selectedIndex = 0;
        }else{
            classSelect.selected = localStorage.getItem("workoutClassroom");
        }
        
        var aClassroom = (this.state.classroom.localeCompare("") === 0 ? classrooms[0] : this.state.classroom);

        this.setState({
            studentClassrooms: classrooms,
            classroom: aClassroom
        });

        /*this.setState({
            studentClassrooms: classrooms
        }, this.buildWeeks(this, classrooms));*/

        //document.getElementsByClassName("loaderBackground")[0].style.display = "none";

    }

    buildWeeks(aContext, classrooms){
        var count = 0;
        var weekWrapperArr = document.getElementsByClassName("Schedule-Grid-Chart");
        var weekWrapper = weekWrapperArr[0];
        
        var aDate = aContext.state.date;
        var aClassroom = (aContext.state.classroom.localeCompare("") === 0 ? classrooms[0] : aContext.state.classroom);
        var aWeekRow;

        var week = <Fragment>
                        <div className="Schedule-Grid-Chart-Titles">
                            <ScheduleWeek height="100%" dayOfWeek="Title" history={aContext.props.history} date={aDate} classroom={aClassroom}/>
                        </div>
                        <div className="Schedule-Grid-Chart-Monday">
                            <ScheduleWeek height="100%" dayOfWeek="Monday" history={aContext.props.history} eventToRemove={aContext.checkGridTitles.bind(aContext)} date={aDate} classroom={aClassroom}/>
                        </div>
                        <div className="Schedule-Grid-Chart-Tuesday">
                            <ScheduleWeek height="100%" dayOfWeek="Tuesday" history={aContext.props.history} eventToRemove={aContext.checkGridTitles.bind(aContext)} date={aDate} classroom={aClassroom}/>
                        </div>
                        <div className="Schedule-Grid-Chart-Wednesday">
                            <ScheduleWeek height="100%" dayOfWeek="Wednesday" history={aContext.props.history} eventToRemove={aContext.checkGridTitles.bind(aContext)} date={aDate} classroom={aClassroom}/>
                        </div>
                        <div className="Schedule-Grid-Chart-Thursday">
                            <ScheduleWeek height="100%" dayOfWeek="Thursday" history={aContext.props.history} eventToRemove={aContext.checkGridTitles.bind(aContext)} date={aDate} classroom={aClassroom}/>
                        </div>
                        <div className="Schedule-Grid-Chart-Friday">
                            <ScheduleWeek height="100%" dayOfWeek="Friday" history={aContext.props.history} eventToRemove={aContext.checkGridTitles.bind(aContext)} date={aDate} classroom={aClassroom}/>
                        </div>
                    </Fragment>;

        ReactDom.render(week, weekWrapper);

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

    async dateChange(event){
        var dateInput = event.target;
        var date = new Date(dateInput.value);

        //console.log(date);

        /*switch(date.getDay()){
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

        }*/
        //console.log(date.getDate());
        //var year = date.getFullYear();
        //var month = this.formatMonth(date.getMonth() + 1);
        //var day = this.formatDay(date.getDate() + 1);

        //dateInput.value = year + "-" + month + "-" + day;

        /*var startDate = dateInput.value;
        var d = new Date(startDate);
        d.setDate(d.getDate() + 4);
        var endDate = d.getFullYear() + "-" + this.formatMonth(d.getMonth() + 1) + "-" + this.formatDay(d.getDate() + 1);

        weeklyGrades = await getStudentGradesForWeek(localStorage.getItem("userID"), this.state.classroom.classroom_id, dateInput.value, endDate);*/

        localStorage.setItem('workoutDate', dateInput.value);

        this.setState({
            date: dateInput.value
        });
    }

    classChange(event){
        var classSelect = document.getElementById("Workout-Classroom-Select");
        var classText = classSelect.options[classSelect.selectedIndex].text;
        var classId = classSelect.options[classSelect.selectedIndex].value;

        var aClassroom;
        var count = 0;

        for(count = 0; count < this.state.studentClassrooms.length; count++){
            if(this.state.studentClassrooms[count].title.localeCompare(classText) === 0 && 
               this.state.studentClassrooms[count].classroom_id === parseInt(classId)){ //Issue is here, adding wrong classroom because of 2 similar class names
                aClassroom = this.state.studentClassrooms[count];
                break;
            }
        }

        localStorage.setItem('workoutClassroom', aClassroom.title);

        this.setState({
            classroom: aClassroom
        });

    }

    printSchedule(event){
        window.print();
    }

    formatMonth(month){

        if(parseInt(month) <  10){
            month = "0" + month;
        }

        return month;
    }

    formatDay(day){

        if(day === 32){
            day = 31;
        }

        if(parseInt(day) <  10){
            day = "0" + day;
        }

        return day;
    }

    onDayClick(event){

        var id = event.target.id;
        var day;

        if(this.state.date === undefined || this.state.date === null || this.state.date === "" ||
           this.state.classroom === undefined || this.state.classroom === null || this.state.classroom === ""){
            return;
        }

        if(id.includes("Content")){
            day = event.target.id.split("-")[3];
        }else{
            day = event.target.id.split("-")[2];
        }   
        
        var dayContainer = document.getElementsByClassName("Blowup-Container")[0];
        dayContainer.style.display = "flex";

        this.setState({
            blowupDay: day
        });
    }

    goBack(){ //This isnt working, start here next time
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }

    //Render the Header component to the DOM/Screen
    render(){

        /*var aDate = this.state.date;
        var aClassroom = (this.state.classroom.localeCompare("") === 0 ? this.state.studentClassrooms[0] : this.state.classroom);*/

        //Start here next time ... need to find way to redirect if data empty
            if(!RedirectService.checkItemForUndefined(this.props.location.state)){
                return RedirectService.decideRedirect();
            }

            var aDate = this.state.date;
            var aClassroom = this.state.classroom;

            var aStudent = (localStorage.getItem("userRole").localeCompare("STUDENT") === 0 ? "" : this.props.location.state.student);

            return(
                <Fragment>
                    <Blowup dayOfWeek={this.state.blowupDay} date={aDate} classroom={aClassroom} student={this.state.studentName} oStudent={aStudent} />
                    {localStorage.getItem("userRole").localeCompare("STUDENT") === 0 ? 
                    <Header title="Schedule" breadCrumbs="Schedule" goBack={true} customClick={this.goBack.bind(this)}/> : 
                    <AdminHeader title={"Schedule"} breadCrumbs="Schedule" goBack={false} customClick={this.goBack.bind(this)}/>}
                    <LoadingSpinner />
                    <div className="scheduleContainer">
                        {localStorage.getItem("userRole").localeCompare("STUDENT") === 0 ? 
                         <Popout hist={this.props.history}/> : 
                         <AdminPopout hist={this.props.history}/>}
                        <div className="scheduleWrapper" id="scheduleWrapper">
                            
                            <div className="Schedule-Week-Filter-Wrapper">
                                <div className="Schedule-Week-Selection-Wrapper">
                                    <h2 className="Workout-Input-Label">Date: </h2><input className="workoutInput" id="Workout-Input-Date" type="date" min="0" max="999" onChange={e => this.dateChange(e)}/>
                                </div>
                                <div className="Schedule-Week-Classroom-Wrapper">
                                    <h2 className="Workout-Select-Classroom-Label">Classroom: </h2><select className="Workout-Classroom-Select" id="Workout-Classroom-Select" onChange={e => this.classChange(e)}></select>
                                </div>
                            </div>

                            <div className="Schedule-Week-ScheduleGrade-Container">

                                <div className="Schedule-Week-ScheduleGrade-Wrapper">

                                    <div className="scheduleGrid" id="scheduleGrid">

                                        <div className="Schedule-Grid-Title">
                                            <h1 className="Schedule-Grid-Title-Text">Physical Activity Log</h1>
                                            <h2 className="Schedule-Grid-Title-Student"></h2>
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
                                                <ScheduleWeek height="100%" dayOfWeek="Title" history={this.props.history} date={aDate} classroom={aClassroom} student={aStudent} />
                                            </div>
                                            <div className="Schedule-Grid-Chart-Monday">
                                                <ScheduleWeek height="100%" dayOfWeek="Monday" history={this.props.history} eventToRemove={this.checkGridTitles.bind(this)} date={aDate} classroom={aClassroom} student={aStudent} customClick={this.onDayClick.bind(this)}/>
                                            </div>
                                            <div className="Schedule-Grid-Chart-Tuesday">
                                                <ScheduleWeek height="100%" dayOfWeek="Tuesday" history={this.props.history} eventToRemove={this.checkGridTitles.bind(this)} date={aDate} classroom={aClassroom} student={aStudent} customClick={this.onDayClick.bind(this)}/>
                                            </div>
                                            <div className="Schedule-Grid-Chart-Wednesday">
                                                <ScheduleWeek height="100%" dayOfWeek="Wednesday" history={this.props.history} eventToRemove={this.checkGridTitles.bind(this)} date={aDate} classroom={aClassroom} student={aStudent} customClick={this.onDayClick.bind(this)}/>
                                            </div>
                                            <div className="Schedule-Grid-Chart-Thursday">
                                                <ScheduleWeek height="100%" dayOfWeek="Thursday" history={this.props.history} eventToRemove={this.checkGridTitles.bind(this)} date={aDate} classroom={aClassroom} student={aStudent} customClick={this.onDayClick.bind(this)}/>
                                            </div>
                                            <div className="Schedule-Grid-Chart-Friday">
                                                <ScheduleWeek height="100%" dayOfWeek="Friday" history={this.props.history} eventToRemove={this.checkGridTitles.bind(this)} date={aDate} classroom={aClassroom} student={aStudent} customClick={this.onDayClick.bind(this)}/>
                                            </div>
                                        </div>
                                    </div>

                                { 
                                    localStorage.getItem("userRole") === "ADMIN" ? 
                                    <Grading date={this.state.date} classroom={aClassroom} student={aStudent}/>
                                    :
                                    ""
                                }

                                </div>

                            </div>

                            <div className="Schedule-Week-Print-Wrapper">
                                <button className="Schedule-Week-Print" onClick={e => this.printSchedule(e)}><i  className="fa fa-print fa-2x"></i></button>
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
/*
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
                                </div>*/
import React, { Fragment } from 'react';
import {baseURI} from '../_services/APIService';
import {getStudentGradesForWeek} from '../_services/GradeService';
import ReactDom from 'react-dom';
import './Grading.css';

class Grading extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            selectedDate: props.date,
            endDate: "",
            classroom: props.classroom,
            gradeCache: [-1, -1]
        };

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 

    }

    componentDidUpdate(){
        var d = new Date(this.props.date);
        d.setDate(d.getDate() + 4);
        var newEndDate = d.getFullYear() + "-" + this.formatMonth(d.getMonth() + 1) + "-" + this.formatDay(d.getDate() + 1);

        if(this.state.endDate !== newEndDate && this.props.classroom.classroom_id !== undefined && this.props.date !== "")
        {
            this.fillGrades(localStorage.getItem("userID"), this.props.classroom.classroom_id, this.props.date, newEndDate);
        }
        
    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        this.saveGradeCache();
    }

    fillGrades(userID, classroomID, startDate, newEndDate){

        var totalScore = 0;
        var weeklyGrades = getStudentGradesForWeek(userID, classroomID, startDate, newEndDate);

        var that = this;

        weeklyGrades.then((value) => {

            if(value !== null){

                for(var count = 1; count <= 5; count++){
                    document.getElementById("Grading-Input-" + count).value = "";
                }

                for(var count = 0; count < value.length; count++){
                    var grade_date = value[count].grade_Date;
                    var grade = value[count].score;

                    totalScore += grade;

                    var d = new Date(grade_date);
                    d.setDate(d.getDate() + 1);

                    var idNum = d.getDay();

                    document.getElementById("Grading-Input-" + idNum).value = grade;

                    var cacheIndex = idNum - 1;
                }

                console.log(totalScore);

                document.getElementById("Grading-Input-6").value = totalScore;

                that.setState({
                    endDate: newEndDate,
                    grades: value
                });

            }

        });
    }

    onUpdateGradeCache(event){
        var input = event.target;
        var grade = input.value;
        var id = input.id.split("-")[2];

        var newGradeCache = this.state.gradeCache;
        
        if(isNaN(grade)){
            grade = -1;
            input.value = "";
        }

        newGradeCache[0] = grade;
        newGradeCache[1] = parseInt(id) - 1;

        this.setState({
            gradeCache: newGradeCache
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

    onHandleGradingPopout(event){
        
        var gradingWrapper = document.getElementsByClassName("Grading-Wrapper")[0];
        var arrow = document.getElementsByClassName("Grading-Arrow-Icon")[0];
        
        if(gradingWrapper.classList.contains("popout")){
            gradingWrapper.classList.remove("popout");
            gradingWrapper.classList.add("hidden");
            arrow.style.transform = "rotate(0deg)";

        }else{
            gradingWrapper.classList.remove("hidden");
            gradingWrapper.classList.add("popout");
            arrow.style.transform = "rotate(180deg)";
        }

    }

    async onGradeChange(event){

        if(!this.props.date){
            return;
        }

        var input = event.target;
        var totalInput = document.getElementById("Grading-Input-6");

        var id = input.id;
        var grade = input.value;
        var date = new Date(this.props.date);

        if(!date || grade === ""){
            return;
        }

        if(isNaN(grade)){
            input.value = "";
            return;
        }else{
            grade = parseInt(grade);
        }
        
        var daysToAdd = parseInt(id.split("-")[2]) - 1;
        date.setDate(date.getDate() + daysToAdd);

        //var strDate = date.getUTCDate() + "/" + date.getUTCMonth() + "/" + date.getUTCFullYear();

        //NEED TO SOMEHOW ADD GRADE HERE NEXT
        var classroom = this.props.classroom;
        console.log(localStorage.getItem("userID"));
        await fetch(baseURI + "/api/grade", {  
            method: "POST",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")},
            body: JSON.stringify({user_id: localStorage.getItem("userID"), classroom_id: classroom.classroom_id, grade_date: date, score: grade})
        }).catch(console.log);

        totalInput.value = grade + parseInt(totalInput.value);

        var cacheIndex = daysToAdd;

    }

    async saveGradeCache(){
        if(!this.props.date){
            return;
        }

        var date = new Date(this.props.date);

        if(!date){
            return;
        }

        var classroom = this.props.classroom;

        var gradeCache = this.state.gradeCache;
        
        var grade = gradeCache[0];
        var id = gradeCache[1];

        if(grade === -1){
            return;
        }

        var daysToAdd = id;
        date.setDate(date.getDate() + daysToAdd);

        await fetch(baseURI + "/api/grade", {  
            method: "POST",                          
            headers: {"Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("auth_token")},
            body: JSON.stringify({user_id: localStorage.getItem("userID"), classroom_id: classroom.classroom_id, grade_date: date, score: grade})
        }).catch(console.log);

    }

    //Render the Header component to the DOM/Screen
    render(){

            return(

                    <div className="Grading-Wrapper">

                        <div className="Grading-Title-Wrapper">
                            <div className="Grading-Arrow" onClick={e => this.onHandleGradingPopout(e)}>
                                <i className="fa fa-arrow-left Grading-Arrow-Icon"> </i>
                            </div>
                            <label className="Grading-Title-Label">Grades</label>
                        </div>

                        <div className="Grading-Day-Wrapper">
                            <input className="Grading-Input" id="Grading-Input-1" onChange={e => this.onUpdateGradeCache(e)} onBlur={e => this.onGradeChange(e)}></input>
                        </div>

                        <div className="Grading-Day-Wrapper">
                            <input className="Grading-Input" id="Grading-Input-2" onChange={e => this.onUpdateGradeCache(e)} onBlur={e => this.onGradeChange(e)}></input>
                        </div>

                        <div className="Grading-Day-Wrapper">
                            <input className="Grading-Input" id="Grading-Input-3" onChange={e => this.onUpdateGradeCache(e)} onBlur={e => this.onGradeChange(e)}></input>
                        </div>

                        <div className="Grading-Day-Wrapper">
                            <input className="Grading-Input" id="Grading-Input-4" onChange={e => this.onUpdateGradeCache(e)} onBlur={e => this.onGradeChange(e)}></input>
                        </div>

                        <div className="Grading-Day-Wrapper">
                            <input className="Grading-Input" id="Grading-Input-5" onChange={e => this.onUpdateGradeCache(e)} onBlur={e => this.onGradeChange(e)}></input>
                        </div >
                            
                        <div className="Grading-Total-Wrapper">
                            <input className="Grading-Input" id="Grading-Input-6" readOnly></input>
                        </div>

                    </div>

            );
            
    }

}

export default Grading;

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
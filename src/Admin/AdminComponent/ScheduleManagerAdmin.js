import React, { Fragment } from 'react';
import './ScheduleManagerAdmin.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout'
import ConfirmModal from '../../Confirm/ConfirmModal';
import ConfirmToast from '../../Confirm/ConfirmToast';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import {RedirectService} from '../../_services/RedirectService';
import {FaArrowDown} from 'react-icons/fa';
import {baseURI} from '../../_services/APIService';
import { parse } from '@fortawesome/fontawesome-svg-core';

class ScheduleManagerAdmin extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                canGoBack: true,
                classroom: props.location.state.classroom,
                idMap: [],
                selectedPath: [],
                listIds: ["Category-Admin-List-Wrapper-0"],
                arrowIds: ["Category-Admin-List-Arrow-0"],
                view: "E",
                allExercises: [],
                scheduledExercises: [],
                allCategories: [],
                scheduledCategories: []
            }
        }

    }
    
    async componentDidMount(){ 
        await this.loadExercisesAndCategoriesForClassroom();
    }

    componentDidUpdate(){
        var view = this.state.view;

        if(view === "E"){
            this.buildExerciseView();
        }else{
            this.buildCategoryView();
        }

    }

    componentWillUnmount(){
        
    }

    async loadExercisesAndCategoriesForClassroom(){

        var exercises;
        var categories;

        var classroomID = this.props.location.state.classroom.classroom_id;

        await fetch(baseURI + "/api/exercise/byclassroom/" + classroomID, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                exercises = result;
            }
        ).catch(console.log);

        await fetch(baseURI + "/api/category/forClassroom/" + classroomID, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                categories = result;
            }
        ).catch(console.log);

        this.setState({
            allExercises: exercises,
            allCategories: categories
        });
    }

    async loadExercisesAndCategoriesForDateRange(startDate, endDate){

        var categoriesForRange;
        var exercisesForRange;

        var classroomID = this.state.classroom.classroom_id;

        await fetch(baseURI + "/api/exercise/forDateRange/" + classroomID + "/" + startDate + "/" + endDate, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                exercisesForRange = result;
            }
        ).catch(console.log);

        await fetch(baseURI + "/api/category/forDateRange/" + classroomID + "/" + startDate + "/" + endDate, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                categoriesForRange = result;
            }
        ).catch(console.log);

        if(exercisesForRange.length === undefined){
            exercisesForRange = [];
        }

        if(categoriesForRange.length === undefined){
            categoriesForRange = [];
        }

        this.setState({
            scheduledExercises: exercisesForRange,
            scheduledCategories: categoriesForRange
        });

    }

    buildExerciseView(){
        var allExercises = this.state.allExercises;
        var scheduledExercises = this.state.scheduledExercises;

        var selectedList = document.getElementsByClassName("Scheduler-Admin-List")[0];
        var allList = document.getElementsByClassName("Scheduler-Admin-AllList")[0];

        while(selectedList.firstChild){
            selectedList.removeChild(selectedList.firstChild);
        }

        while(allList.firstChild){
            allList.removeChild(allList.firstChild);
        }

        for(var count = 0; count < allExercises.length; count++){

            var allListItem = document.createElement("div");
            var allListItemText = document.createElement("h2");

            allListItem.classList.add("Scheduler-Admin-AllList-Item");
            allListItem.id = "Scheduler-Admin-AllList-Item-" + count;
            allListItem.onclick = (e) => this.onExerciseClick(e);

            allListItemText.classList.add("Scheduler-Admin-AllList-ItemText");
            allListItemText.id = "Scheduler-Admin-AllList-ItemText-" + count;
            allListItemText.textContent = allExercises[count].title;

            allListItem.classList.add((count % 2 === 0 ? "Even" : "Odd"));

            for(var selCount = 0; selCount < scheduledExercises.length; selCount++){
                if(allExercises[count].exercise_id === scheduledExercises[selCount].exercise_id){
                    allListItem.classList.add("Selected");
                    break;
                }
            }

            allListItem.appendChild(allListItemText);
            allList.appendChild(allListItem);

        }

        for(var count = 0; count < scheduledExercises.length; count++){
            var selListItem = document.createElement("div");
            var selListItemText = document.createElement("h2");

            selListItem.classList.add("Scheduler-Admin-List-Item");
            selListItem.id = "Scheduler-Admin-List-Item-" + count;

            selListItemText.classList.add("Scheduler-Admin-List-ItemText");
            selListItemText.id = "Scheduler-Admin-List-ItemText-" + count;
            selListItemText.textContent = scheduledExercises[count].title;

            selListItem.classList.add((count % 2 === 0 ? "Even" : "Odd"));

            selListItem.appendChild(selListItemText);
            selectedList.appendChild(selListItem);
        }

    }

    onExerciseClick(event){
        var idNum = parseInt(event.target.id.split("-")[4]);
        console.log(event.target.id);
        var newScheduledExercises = this.state.scheduledExercises;
        var exercises = this.state.allExercises;
        var selectedExercise = exercises[idNum];

        var selectedIndex = -1;

        for(var count = 0 ; count < newScheduledExercises.length; count++){
            if(newScheduledExercises[count].exercise_id === selectedExercise.exercise_id){
                selectedIndex = count;
                break;
            }
        }

        if(selectedIndex === -1){
            event.target.classList.add("Selected");
            console.log(this.state.scheduledExercises); //NEED TO START HERE NEXT TIME - FOR SOME REASON COMING UP AS AN OBJECT
            newScheduledExercises.push(selectedExercise);
        }else{
            event.target.classlist = "";
            event.target.classList.add("Scheduler-Admin-AllList-Item");
            event.target.classList.add((idNum % 2 === 0 ? "Even" : "Odd"));
            
            newScheduledExercises.splice(selectedIndex, 1);
        }

        this.setState({
            scheduledExercises: newScheduledExercises
        });
    }

    onChangeView(event){
        var checked = event.target.checked;
        var newView = "";

        if(checked){
            newView = "C";
        }else{
            newView = "E";
        }

        this.setState({
            view: newView
        });
    }

    onDateChange(event){
        var startDateInput = document.getElementsByClassName("Scheduler-Admin-Start-Date")[0];
        var endDateInput = document.getElementsByClassName("Scheduler-Admin-End-Date")[0];

        var startDateVal = startDateInput.value;
        var endDateVal = endDateInput.value;

        if(startDateVal !== "" && endDateVal !== ""){

            var startUTCDate = new Date(startDateVal);
            var endUTCDate = new Date(endDateVal);

            var startDate = new Date(startUTCDate.getTime() + (startUTCDate.getTimezoneOffset() * 60000));
            var endDate = new Date(endUTCDate.getTime() + (endUTCDate.getTimezoneOffset() * 60000));

            if(endDate >= startDate){
                

                this.loadExercisesAndCategoriesForDateRange(startDate, endDate);

                /*if(this.state.view === "C"){
                    this.loadCategoriesForDateRange(this.formatDateForRange(startDate), this.formatDateForRange(endDate));
                }else{
                    this.loadExercisesForDateRange(this.formatDateForRange(startDate), this.formatDateForRange(endDate));
                }*/

            }else{
                this.displayMessage("End Date must be greater than or equal to the Start Date!");
                endDateInput.value = "";
            }

        }
    }

    async onSave(event){

        var startDateInput = document.getElementsByClassName("Scheduler-Admin-Start-Date")[0];
        var endDateInput = document.getElementsByClassName("Scheduler-Admin-End-Date")[0];

        var startDateVal = startDateInput.value;
        var endDateVal = endDateInput.value;

        var classroomID = this.state.classroom.classroom_id;

        if(startDateVal !== "" && endDateVal !== ""){

            var startUTCDate = new Date(startDateVal);
            var endUTCDate = new Date(endDateVal);

            var startDate = new Date(startUTCDate.getTime() + (startUTCDate.getTimezoneOffset() * 60000));
            var endDate = new Date(endUTCDate.getTime() + (endUTCDate.getTimezoneOffset() * 60000));

            await fetch(baseURI + "/api/exercise/forDateRange/" + classroomID + "/" + startDate + "/" + endDate, {  
                method: "POST",                          
                headers: {"Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("auth_token")},
                body: JSON.stringify(this.state.scheduledExercises) //Need to add in other fields here, back end and front end
            }).catch(console.log);

        }        

    }

    formatDateForRange(d){
        var d = new Date(d);

        var date = d.getUTCDate();
        var month = d.getUTCMonth();
        var year = d.getFullYear();

        date = (date < 10 ? "0" + date : date);
        month = (month < 10 ? "0" + month : month);

        var formattedDate = year + "-" + month + "-" + date;
        return formattedDate;
    }

    closeModal(){
        document.getElementById("modalContainer").style.display = "none";
    }

    displayMessage(textValue){
        // Get the snackbar confirmation
        var confirmation = document.getElementById("snackbar");
        confirmation.textContent = textValue;
        confirmation.className = "show";
        setTimeout(function(){ confirmation.className = confirmation.className.replace("show", ""); }, 3000);
    }

    goBack(){ //This isnt working, start here next time
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }
    
    render(){

        var classroom = this.props.location.state.classroom.title;

        return(

            <div className="Scheduler-Admin-Container">
                <AdminHeader title={"Scheduling"} breadCrumbs={"Scheduling for " + classroom} goBack={true} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Delete exercise?" yesText="Yes" noText="No" onYes={e => {this.deleteExercise(); this.closeModal(); this.confirmBackendTransaction();}}/>
                <LoadingSpinner />
                <AdminPopout hist={this.props.history}/>
                <ConfirmToast text="Exercise created!"/>

                <div className="Scheduler-Admin-Wrapper">

                    <div className="Scheduler-Admin-Date-Wrapper">
                        
                        <div className="Scheduler-Admin-Start-Date-Wrapper">
                            <label className="Scheduler-Admin-Start-Date-Label">Start Date</label>
                            <input className="Scheduler-Admin-Start-Date" type="date" onChange={e => this.onDateChange(e)}/>
                        </div>

                        <div className="Scheduler-Admin-End-Date-Wrapper">
                            <label className="Scheduler-Admin-End-Date-Label">End Date</label>
                            <input className="Scheduler-Admin-End-Date" type="date" onChange={e => this.onDateChange(e)}/>
                        </div>

                    </div>

                    <div className="Scheduler-Admin-Switch-Wrapper">
                        <div className="Scheduler-Admin-Switch-InnerWrapper">
                            <h2 className="Scheduler-Admin-H2-E"><i className="fa fa-child" title="Exercises" style={{fontSize: "40px"}}/></h2>
                            <label className="switch">
                                <input type="checkbox" onChange={e => this.onChangeView(e)}/>
                                <span className="slider round"></span>
                            </label>
                            <h2 className="Scheduler-Admin-H2-C"><i className="fa fa-folder" title="Categories" style={{fontSize: "40px"}}/></h2>
                        </div>
                    </div>

                    <div className="Scheduler-Admin-List-Wrapper">
                        <div className="Scheduler-Admin-List">

                        </div>
                    </div>

                    <div className="Scheduler-Admin-Save-Button-Wrapper">
                        <button className="Scheduler-Admin-Save-Button" onClick={e => this.onSave(e)}>Save</button>
                    </div>

                    { this.state.view === "C" ?

                        <div className="Category-Admin-Wrapper">
                            <div className="Category-Admin-Classroom-Wrapper">
                                <div className="Category-Admin-Classroom">
                                    <h1 className="Category-Admin-Classroom-Title">{classroom}</h1>
                                </div>
                            </div>

                            <i className="fa fa-arrow-down Category-Admin-Arrow" style={{fontSize: "120px"}}></i>

                            <div className="Category-Admin-List-Wrapper" id="Category-Admin-List-Wrapper-0">
                                <div className="Category-Admin-List" id="Category-Admin-List-0">

                                </div>
                                <div className="Category-Admin-Button-Wrapper">
                                    <button className="Category-Admin-Exercise-Button" id="Category-Admin-Exercise-Button-0" onClick={e => this.onAddExercises(e)}><i class="fa fa-child" id="Category-Admin-Exercise-Icon-0"/></button>
                                    <button className="Category-Admin-Add-Button" id="Category-Admin-Add-Button-0" onClick={e => this.onAddCategory(e)}>+</button>
                                    <button className="Category-Admin-Subtract-Button" id="Category-Admin-Subtract-Button-0" onClick={e => this.onDeleteCategory(e)}>-</button>
                                </div>
                            </div>

                        </div>
                        :
                        <div className="Scheduler-Admin-AllList-Wrapper" id="Scheduler-Admin-AllList-Wrapper">
                            <div className="Scheduler-Admin-AllList" id="Scheduler-Admin-AllList">

                            </div>
                    </div>
                    }

                </div>

            </div>
        );
            
    }
}

export default ScheduleManagerAdmin;


//"react-router-dom": "^6.0.0-alpha.1",
//<div className="exerciseFiller-Admin"></div>
/*<FaArrowDown color='black' size='10rem' style={{height: "100px", width: "70px"}}/>

                    <i className="fa fa-arrow-down" style={{fontSize: "100px"}}></i> */

                    /*<div className="Category-Admin-ListItem-Wrapper">
                                <h2 className="Category-Admin-ListItem">Strength</h2>
                            </div> */

                            /*
                            
                            */
import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './GroupMemberClassroom.css';
import ExerciseTileCopy from '../../Admin/AdminShare/ExerciseTileCopy';
import AdminHeader from '../../Admin/AdminHeader/AdminHeader';
import AdminPopout from '../../Admin/AdminPopout/AdminPopout';
import ConfirmToast from '../../Confirm/ConfirmToast';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { Link } from 'react-router-dom';
import {RedirectService} from '../../_services/RedirectService';
import {baseURI} from '../../_services/APIService';

class GroupMemberClassroom extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                classroom: props.location.state.classroom,
                canGoBack: true,
                componentExercises: "",
                componentBlobs: "",
                exImageMap: "",
                selectedExercises: [],
                selectedExercisesIds: [],
                teacherClassrooms: []
            };
        }

        window.addEventListener("resize", this.triggerRerender.bind(this));

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    async componentDidMount(){ 
        
        await this.getExercisesAndTeachersClassrooms();

        /*if(RedirectService.checkItemForUndefined(this.props.location.state)){
            if(this.exercisesScheduled()){
                this.renderScheduledTiles();
            }else{
                this.renderTiles();
            }
        }*/
    }

    componentDidUpdate(){
        this.renderTiles();
    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    triggerRerender(){
        this.setState({
            triggerRerender: true
        });
    }

    async getExercisesAndTeachersClassrooms(){

        var exercises = [];
        var exerciseBlobs = [];
        var teachersClassrooms = [];

        var classroomID = this.state.classroom.classroom_id;

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

        await fetch(baseURI + "/api/exercise_blob/foraclass/" + classroomID, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                exerciseBlobs = result;
            }
        ).catch(console.log);

        await fetch(baseURI + "/api/classroom/forteacher/" + localStorage.getItem("userID"), {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                teachersClassrooms = result;
            }
        ).catch(console.log);

        this.setState({
            componentExercises: exercises,
            componentBlobs: exerciseBlobs,
            teacherClassrooms: teachersClassrooms
        });
    }

    renderTiles(){

        document.getElementsByClassName("loaderBackground")[0].style.display = "flex";

        var classroomSelect = document.getElementsByClassName("GroupMemberClassroom-ToClassroom-Select")[0];

        var exercises = this.state.componentExercises;
        var exerciseBlobs = this.state.componentBlobs;
        var teacherClassrooms = this.state.teacherClassrooms;

        var count = 0;
        var componentWrapper = document.getElementById("groupMemberClassroomWrapper");
        var numRows;

        componentWrapper.innerHTML = '';

        var aTile;
        var aFlexRow;
        var countOuter;
        var countInner;

        var tilesPerRow = this.calculateRowCount();
        numRows = Math.ceil(exercises.length/tilesPerRow);

        for(countOuter = 0; countOuter < numRows; countOuter++){
            
            aFlexRow = document.createElement('div');
            aFlexRow.className = "GroupMemberClassroom-Tile-Wrapper";

            for(countInner = 0; countInner < tilesPerRow; countInner++){

                aTile = ReactDom.render(this.renderTileRow(exercises.slice(countOuter*tilesPerRow, countOuter*tilesPerRow + tilesPerRow), exerciseBlobs), aFlexRow);
                //ReactDOM.render(aTile, aFlexRow);
            }

            componentWrapper.appendChild(aFlexRow);
        }

        while(classroomSelect.firstChild){
            classroomSelect.removeChild(classroomSelect.lastChild);
        }

        for(var count = 0; count < teacherClassrooms.length; count++){
            var opt = document.createElement("option");
            opt.value = teacherClassrooms[count].title;
            opt.textContent = teacherClassrooms[count].title;
            classroomSelect.appendChild(opt);
        }

        document.getElementsByClassName("loaderBackground")[0].style.display = "none";

    }

    async searchExercises(event){

        /*if(this.exercisesScheduled()){
            this.searchScheduledExercises();
            return;
        }*/

        document.getElementsByClassName("loaderBackground")[0].style.display = "flex";

        var exercises = [];
       
        var searchText = document.getElementsByClassName("Fit4Life-Searchbar")[0].value.trim();

        var classroomID = this.state.classroom.classroom_id;

        await fetch(baseURI + "/api/exercise/byclassroom/activated/" + classroomID, {  
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

        for(var exCount = 0; exCount < exercises.length; exCount++){
            if(!exercises[exCount].title.toLowerCase().includes(searchText.toLowerCase())){
                exercises.splice(exCount, 1);
                exCount = exCount - 1;
            }
        }

        this.setState({
            componentExercises: exercises
        });

        document.getElementsByClassName("loaderBackground")[0].style.display = "none";

    }

    selectExercise(event, currExercise){

        var selectedExercises = this.state.selectedExercises;
        var selectedExercisesIds = this.state.selectedExercisesIds;

        if(selectedExercisesIds.includes(currExercise.exercise_id)){
            var index = selectedExercisesIds.indexOf(currExercise.exercise_id);
            selectedExercisesIds.splice(index, 1);
            selectedExercises.splice(index, 1);
        }else{
            selectedExercisesIds.push(currExercise.exercise_id);
            selectedExercises.push(currExercise);
        }

        this.setState({
            selectedExercises: selectedExercises,
            selectedExercisesIds: selectedExercisesIds
        });

    }

    showModal(eventObj){

        var idNum = eventObj.event.target.id.split("-")[1];
        var aClassroom = this.state.teacherClassrooms[idNum];

        this.setState({
            focusedClassroom: aClassroom,
            focusedClassroomItemID: idNum
        });

        document.getElementById("modalContainer").style.display = "flex";
    }

    closeModal(){
        document.getElementById("modalContainer").style.display = "none";
    }

    confirmBackendTransaction(){
        // Get the snackbar confirmation
        var confirmation = document.getElementById("snackbar");
        confirmation.className = "show";
        setTimeout(function(){ confirmation.className = confirmation.className.replace("show", ""); }, 3000);
    }

    renderTileRow(exercises, blobs){
        return exercises.map(this.renderTile.bind(this, blobs));
    }

    renderTile(blobs, currExercise){

        var aImage = blobs[currExercise.exercise_id];
        var count = 0;

        var isSelected = (this.state.selectedExercisesIds.includes(currExercise.exercise_id) ? true : false);

        return <ExerciseTileCopy selected={isSelected} exercise={currExercise.title} image={aImage} tileClickEvent={e=>this.selectExercise(e, currExercise)} />
    }


    calculateRowCount(){
        var viewportWidth = window.innerWidth;

        if(viewportWidth >= 1440){
            return 4;
        }else if(viewportWidth >= 1024){
            return 3;
        }else{
            return 2;
        }
    }

    async copyExercises(event){

        var selectedExercises = this.state.selectedExercises;
        var teacherClassrooms = this.state.teacherClassrooms;

        var classroomSelect = document.getElementsByClassName("GroupMemberClassroom-ToClassroom-Select")[0];
        var classroom = classroomSelect.value;

        var classroomID = "";

        for(var count = 0; count < teacherClassrooms.length; count++){
            if(teacherClassrooms[count].title === classroom){
                classroomID = teacherClassrooms[count].classroom_id;
                break;
            }
        }

        if(classroomID === ""){
            return;
        }

        await fetch(baseURI + "/api/exercise/copy/" + classroomID, {  
            method: "POST",                          
            headers: {"Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("auth_token")},
            body: JSON.stringify(selectedExercises) 
        }).catch(console.log);

        classroomSelect.value = "";

        this.closeToClassroom(null);
        this.confirmBackendTransaction();
    }

    formatDateForRange(d){
        var d = new Date(d);

        var date = d.getUTCDate();
        var month = d.getUTCMonth() + 1;
        var year = d.getFullYear();

        date = (date < 10 ? "0" + date : date);
        month = (month < 10 ? "0" + month : month);

        var formattedDate = year + "-" + month + "-" + date;
        return formattedDate;
    }

    openGroupNameModel(event){

        var toClassroomCover = document.getElementsByClassName("GroupMemberClassroom-ToClassroom-Cover")[0];
        toClassroomCover.style.display = "flex";

    }

    closeToClassroom(event){

        var toClassroomCover = document.getElementsByClassName("GroupMemberClassroom-ToClassroom-Cover")[0];
        document.getElementsByClassName("GroupMemberClassroom-ToClassroom-Select")[0].value = "";

        toClassroomCover.style.display = "none";

    }

    goBack(){ //This isnt working, start here next time
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }

    //Render the Header component to the DOM/Screen
    render(){

        if(!RedirectService.checkItemForUndefined(this.props.location.state)){
            return RedirectService.decideRedirect();
        }

        var classroom = this.props.location.state.classroom.title;
        //var component = this.props.location.state.selectedComponent.title;

        return(
            <Fragment>
                <AdminHeader title="Exercises" breadCrumbs={"Exercises"} goBack={true} customClick={this.goBack.bind(this)}/>
                <LoadingSpinner />

                <div className="GroupMemberClassroom-ToClassroom-Cover">
                    <div className="GroupMemberClassroom-ToClassroom-Wrapper">
                        <div className="GroupMemberClassroom-ToClassroom-TopWrapper">
                            <label className="GroupMemberClassroom-ToClassroom-Label">To Classroom:</label>
                            <select className="GroupMemberClassroom-ToClassroom-Select"></select>
                        </div>
                        <div className="GroupMemberClassroom-ToClassroom-BottomWrapper">
                            <button className="GroupMemberClassroom-ToClassroom-OkButton" onClick={e => this.copyExercises(e)}>OK</button>
                            <button className="GroupMemberClassroom-ToClassroom-CancelButton" onClick={e => this.closeToClassroom(e)}>Cancel</button>
                        </div>
                    </div>
                </div>

                <div className="groupMemberClassroomContainer">
                    <AdminPopout hist={this.props.history}/>
                    <ConfirmToast text="Exercises copied!"/>
                    <div className="groupMemberClassroomWrapper" id="groupMemberClassroomWrapper">
                        
                    </div>
                    <div className="Fit4Life-SearchbarWrapper">
                        <div className="Fit4Life-SearchElements-Wrapper">
                            <input className="Fit4Life-Searchbar"/>
                            <button className="Fit4Life-SearchButton" onClick={e => this.searchExercises(e)}>Search</button>
                            <button className="GroupMemberClassroom-AddExerciseCopy-Button" onClick={e => this.openGroupNameModel(e)}>Add</button>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default GroupMemberClassroom;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
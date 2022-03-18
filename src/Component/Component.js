import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './Component.css';
import Header from '../Header/Header';
import ExerciseTile from './ExerciseTile';
import Popout from '../Popout/Popout';
import AdminHeader from '../Admin/AdminHeader/AdminHeader';
import AdminPopout from '../Admin/AdminPopout/AdminPopout';
import ConfirmToast from '../Confirm/ConfirmToast';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import {RedirectService} from '../_services/RedirectService';
import {baseURI} from '../_services/APIService';
import {authService} from '../_services/AuthenticationService';
import ExerciseService from '../_services/ExerciseService';
import ExerciseBlobService from '../_services/ExerciseBlobService';
import BuilderService from '../_services/BuilderService';

class Component extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                classroom: props.location.state.selectedClassroom,
                canGoBack: true,
                componentExercises: [],
                exImageMap: "",
                isLoading: false
            };
        }

        this.exerciseService = ExerciseService.getInstance();
        this.exerciseBlobService = ExerciseBlobService.getInstance();
        this.builderService = BuilderService.getInstance();

        window.addEventListener("resize", this.triggerRerender.bind(this));

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){
        this.renderTiles();
        authService.checkTokenValidity(this.props.history);
    }

    componentDidUpdate(){

    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    triggerRerender(){
        this.setState({
            triggerRerender: true
        });
    }

    async renderTiles(){

        this.setState({
            isLoading: true
        });

        var exercises = [];
        var exerciseBlobs = [];
        var componentWrapper = document.getElementById("componentWrapper");

        var classroomID = this.state.classroom.classroomID;

        if(await this.exercisesScheduled()){
            var date = new Date();
            date = this.formatDateForRange(date);
    
            exercises = await this.exerciseService.GetExercisesWithinDateRange(classroomID, date);
        }else{
            exercises = await this.exerciseService.GetActivatedExercisesForClassroom(classroomID);
        }

        exerciseBlobs = await this.exerciseBlobService.GetExerciseBlobsForClass(classroomID);

        let exerciseImageMap = this.builderService.BuildExerciseImageMap(exercises, exerciseBlobs);

        /*var numRows;

        componentWrapper.innerHTML = '';

        var aTile;
        var aFlexRow;
        var countOuter;
        var countInner;

        var tilesPerRow = this.calculateRowCount();
        numRows = Math.ceil(exercises.length/tilesPerRow);

        for(countOuter = 0; countOuter < numRows; countOuter++){
            
            aFlexRow = document.createElement('div');
            aFlexRow.className = "Component-Tile-Wrapper";

            for(countInner = 0; countInner < tilesPerRow; countInner++){

                aTile = ReactDom.render(this.renderTileRow(exercises.slice(countOuter*tilesPerRow, countOuter*tilesPerRow + tilesPerRow), exerciseBlobs), aFlexRow);
                //ReactDOM.render(aTile, aFlexRow);
            }

            componentWrapper.appendChild(aFlexRow);
        }*/

        this.setState({
            componentExercises: exercises,
            componentBlobs: exerciseBlobs,
            exerciseImageMap: exerciseImageMap,
            isLoading: false
        });

    }

    async searchExercises(event){

        this.setState({
            isLoading: true
        });

        var exercises = [];
        var exerciseBlobs = [];
        var count = 0;
        var componentWrapper = document.getElementById("componentWrapper");
        var searchText = document.getElementsByClassName("Fit4Life-Searchbar")[0].value.trim();

        var classroomID = this.state.classroom.classroom_id;
        //var componentID = this.state.component.component_id;

        var classCompID;

        if(await this.exercisesScheduled()){
            var date = new Date();
            date = this.formatDateForRange(date);
    
            exercises = await this.exerciseService.GetExercisesWithinDateRange(classroomID, date);
        }else{
            exercises = await this.exerciseService.GetActivatedExercisesForClassroom(classroomID);
        }

        exerciseBlobs = await this.exerciseBlobService.GetExerciseBlobsForClass(classroomID);

        var tempNumOfTiles = 40;
        var numRows;

        for(var exCount = 0; exCount < exercises.length; exCount++){
            if(!exercises[exCount].title.toLowerCase().includes(searchText.toLowerCase())){
                exercises.splice(exCount, 1);
                exCount = exCount - 1;
            }
        }

        //var tempArr = ["Running", "Rowing", "Marathon", "Laps", "Swims", "Running", "Rowing", "Marathon", "Laps","Running", "Rowing", "Marathon", "Laps","Running", "Rowing", "Marathon", "Laps"]

        /*var componentWrapper = document.getElementById("componentWrapper");*/
        componentWrapper.innerHTML = '';

        var aTile;
        var aFlexRow;
        var countOuter;
        var countInner;

        var tilesPerRow = this.calculateRowCount();
        numRows = Math.ceil(exercises.length/tilesPerRow);

        for(countOuter = 0; countOuter < numRows; countOuter++){
            
            aFlexRow = document.createElement('div');
            aFlexRow.className = "Component-Tile-Wrapper";

            for(countInner = 0; countInner < tilesPerRow; countInner++){

                aTile = ReactDom.render(this.renderTileRow(exercises.slice(countOuter*tilesPerRow, countOuter*tilesPerRow + tilesPerRow), exerciseBlobs), aFlexRow);
                //ReactDOM.render(aTile, aFlexRow);
            }

            componentWrapper.appendChild(aFlexRow);
        }

        this.setState({
            componentExercises: exercises,
            isLoading: false
        });

    }

    goToExercise(event, selExercise){

        if(localStorage.getItem("userRole").localeCompare("STUDENT") === 0){
            this.props.history.push({
                pathname: "/exercise",
                state: {exercise: selExercise, classroom: this.state.classroom}
            });
        }else{
            this.showAdminNotAllowed();
        }
    }

    showAdminNotAllowed(){
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

        return <ExerciseTile exercise={currExercise.title} image={aImage} tileClickEvent={e=>this.goToExercise(e, currExercise)} />
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

    async exercisesScheduled(){

        var exercises = [];

        var date = new Date();
        date = this.formatDateForRange(date);

        var classroomID = this.state.classroom.classroom_id;
    
        exercises = await this.exerciseService.GetExercisesWithinDateRange(classroomID, date);

        if(exercises.length === undefined || 
           exercises.length === null || 
           exercises.length === 0){
            return false;
        }

        return true;
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

    onGoToCategoryView(event){
        this.props.history.push({
            pathname: "/categoryView",
            state: {goBack: true, classroom: this.state.classroom}
        });
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

        var classroom = this.props.location.state.selectedClassroom.title;
        //var component = this.props.location.state.selectedComponent.title;

        return(
            <Fragment>
                {localStorage.getItem("userRole").localeCompare("STUDENT") === 0 ?
                <Header title={"Exercises"} breadCrumbs={"Exercises for " + classroom} goBack={true} customClick={this.goBack.bind(this)}/> :
                <AdminHeader title="Preview" breadCrumbs={"Preview for class " + classroom} goBack={true} customClick={this.goBack.bind(this)}/>}
                <LoadingSpinner isLoading={this.state.isLoading}/>
                <button className="Fit4Life-CategoryView" onClick={e => this.onGoToCategoryView(e)}><i className="fa fa-folder test"/></button>
                <div className="componentContainer">
                    <Popout hist={this.props.history}/>
                    <AdminPopout hist={this.props.history}/>
                    <ConfirmToast text="Cannot access in Admin mode!"/>
                    <div className="componentWrapper" id="componentWrapper">
                        
                    </div>
                    <div className="Fit4Life-SearchbarWrapper">
                        <div className="Fit4Life-SearchElements-Wrapper">
                            <input className="Fit4Life-Searchbar"/>
                            <button className="Fit4Life-SearchButton" onClick={e => this.searchExercises(e)}>Search</button>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default Component;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
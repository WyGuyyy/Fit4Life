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
import { Link } from 'react-router-dom';
import {RedirectService} from '../_services/RedirectService';
import {baseURI} from '../_services/APIService';

class Component extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                classroom: props.location.state.selectedClassroom,
                canGoBack: true,
                componentExercises: "",
                exImageMap: ""
            };
        }

        window.addEventListener("resize", this.triggerRerender.bind(this));

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
        if(RedirectService.checkItemForUndefined(this.props.location.state)){
            this.renderTiles();
        }
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

        document.getElementsByClassName("loaderBackground")[0].style.display = "flex";

        var exercises = [];
        var exerciseBlobs = [];
        var count = 0;
        var componentWrapper = document.getElementById("componentWrapper");

        var classroomID = this.state.classroom.classroom_id;
        //var componentID = this.state.component.component_id;

        var classCompID;

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

        var tempNumOfTiles = 40;
        var numRows;

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
            componentExercises: exercises
        });

        document.getElementsByClassName("loaderBackground")[0].style.display = "none";

    }

    async searchExercises(event){

        document.getElementsByClassName("loaderBackground")[0].style.display = "flex";

        var exercises = [];
        var exerciseBlobs = [];
        var count = 0;
        var componentWrapper = document.getElementById("componentWrapper");
        var searchText = document.getElementsByClassName("Fit4Life-Searchbar")[0].value.trim();

        var classroomID = this.state.classroom.classroom_id;
        //var componentID = this.state.component.component_id;

        var classCompID;

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
            componentExercises: exercises
        });

        document.getElementsByClassName("loaderBackground")[0].style.display = "none";

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

    async getExerciseImage(exerciseID){

        var exerciseBlob;
        var buffer;

        await fetch(baseURI + "/api/exercise_blob/" + exerciseID  , { 
            method: "GET"                         
            })
            .then(res => res.text())
            .then(
                (text) => {

                    var result = text.length ? JSON.parse(text) : {};
                    exerciseBlob = result;
          
                }
            )
        .catch(console.log);

        buffer = "data:" + exerciseBlob.contentType + ";base64," + exerciseBlob.data;
        return buffer;
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
                <LoadingSpinner />
                <button className="Fit4Life-CategoryView" onClick={e => this.onGoToCategoryView(e)}><i className="fa fa-folder"/></button>
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
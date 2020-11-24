import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './Component.css';
import Header from '../Header/Header';
import ExerciseTile from './ExerciseTile';
import Popout from '../Popout/Popout';
import AdminHeader from '../Admin/AdminHeader/AdminHeader';
import AdminPopout from '../Admin/AdminPopout/AdminPopout';
import ConfirmToast from '../Confirm/ConfirmToast';
import { Link } from 'react-router-dom';
import {RedirectService} from '../_services/RedirectService';

class Component extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                component: props.location.state.selectedComponent,
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

        var exercises = [];
        var exerciseBlobs = [];
        var count = 0;
        var componentWrapper = document.getElementById("componentWrapper");

        var classroomID = this.state.classroom.classroom_id;
        var componentID = this.state.component.component_id;

        var classCompID;

        await fetch("http://localhost:8080/api/exercise/bycomponent/" + componentID, {  
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

        await fetch("http://localhost:8080/api/exercise_blob/foracomp/" + componentID, {  
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

    }

    goToExercise(event, selExercise){

        if(localStorage.getItem("userRole").localeCompare("STUDENT") === 0){
            this.props.history.push({
                pathname: "/exercise",
                state: {exercise: selExercise, component: this.state.component, classroom: this.state.classroom}
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

        await fetch("http://localhost:8080/api/exercise_blob/" + exerciseID  , { 
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
        var component = this.props.location.state.selectedComponent.title;

        return(
            <Fragment>
                {localStorage.getItem("userRole").localeCompare("STUDENT") === 0 ?
                <Header title={"Exercises"} breadCrumbs={"Exercises for " + classroom + ">" + component} goBack={true} customClick={this.goBack.bind(this)}/> :
                <AdminHeader title="Preview" breadCrumbs={"Preview for class " + classroom} goBack={true} customClick={this.goBack.bind(this)}/>}
                <div className="componentContainer">
                    <Popout hist={this.props.history}/>
                    <AdminPopout hist={this.props.history}/>
                    <ConfirmToast text="Cannot access in Admin mode!"/>
                    <div className="componentWrapper" id="componentWrapper">
                        
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
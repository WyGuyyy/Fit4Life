import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './Component.css';
import Header from '../Header/Header';
import ExerciseTile from './ExerciseTile'
import Popout from '../Popout/Popout'
import { Link } from 'react-router-dom';

class Component extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            component: props.location.state.selectedComponent,
            classroom: props.location.state.selectedClassroom,
            canGoBack: true,
            componentExercises: "",
            exImageMap: ""
        };

        window.addEventListener("resize", this.triggerRerender.bind(this));

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
        this.renderTiles();
    }

    componentDidUpdate(){

    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    /*async renderTiles(){

        var exercises;
        var count = 0;
        var exerciseWrapper = document.getElementById("classroomWrapper");

        //await fetch("http://192.168.1.5:8080/api/classroom", {
            await fetch("http://localhost:8080/api/exercise", {  
                method: "GET",                          
                headers: {"Content-Type": "application/json"}
            })
            .then(res => res.text())
            .then(
                (text) => {
                    var result = text.length ? JSON.parse(text) : {};
                    exercises = result;
                }
            ).catch(console.log);

            for(count = 0; count < components.length; count++){
                var exerciseTile = document.createElement("button");
                var title = components[count].title;

                componentButton.classList.add("homeButton");
                componentButton.id = "Home-Button-" + count;
                componentButton.onclick = e => this.goToComponent(e);
                componentButton.textContent = title;

                exerciseWrapper.appendChild(componentButton);
            }
    }*/

    triggerRerender(){
        this.setState({
            triggerRerender: true
        });
    }

    async renderTiles(){

        var exercises;
        var exerciseBlobs;
        var count = 0;
        var componentWrapper = document.getElementById("componentWrapper");

        var classroomID = this.state.classroom.classroom_id;
        var componentID = this.state.component.component_id;

        var classCompID;

        /*await fetch("http://localhost:8080/api/component/classcomp/"  + classroomID + "/" + componentID, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                classCompID = result;
            }
        ).catch(console.log);*/


        await fetch("http://localhost:8080/api/exercise/bycomponent/" + componentID, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json"}
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
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.text())
        .then(
            (text) => {
                //console.log(text);
                var result = text.length ? JSON.parse(text) : {};
                //exerciseBlobs = result;
                exerciseBlobs = result;
            }
        ).catch(console.log);

        console.log(exerciseBlobs);

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

        console.log(tilesPerRow);

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

        this.props.history.push({
            pathname: "/exercise",
            state: {exercise: selExercise, component: this.state.component, classroom: this.state.classroom}
        });
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

        console.log(aImage);

        /*for(count = 0; count < blobs.length; count++){
            if(blobs[count].comp_ex_id === currExercise.exercise_id){
                aImage = blobs[count];
                break;
            }
        }*/

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
        console.log(this.props);
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }

    //Render the Header component to the DOM/Screen
    render(){

        var classroom = this.props.location.state.selectedClassroom.title;
        var component = this.props.location.state.selectedComponent.title;

        return(
            <Fragment>
                <Header title={"Exercises"} breadCrumbs={"Exercises for " + classroom + ">" + component} goBack={true} customClick={this.goBack.bind(this)}/>
                <div className="componentContainer">
                    <Popout />
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
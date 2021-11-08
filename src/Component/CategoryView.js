import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './CategoryView.css';
import Header from '../Header/Header';
import ExerciseTile from './ExerciseTile';
import FolderTile from './FolderTile';
import Popout from '../Popout/Popout';
import AdminHeader from '../Admin/AdminHeader/AdminHeader';
import AdminPopout from '../Admin/AdminPopout/AdminPopout';
import ConfirmToast from '../Confirm/ConfirmToast';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { Link } from 'react-router-dom';
import {RedirectService} from '../_services/RedirectService';
import {baseURI} from '../_services/APIService';

class CategoryView extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                classroom: props.location.state.classroom,
                canGoBack: true,
                idMap: [],
                selectedPath: [],
                leafFolder: false,
                currentTitle: props.location.state.classroom.title,
                categoryExercises: [],
                categoryBlobs: []
            };
        }

        window.addEventListener("resize", this.triggerRerender.bind(this));

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
        if(RedirectService.checkItemForUndefined(this.props.location.state)){
            
            this.fetchTopLevelCategories();

            /*if(!this.categoriesScheduled()){
                this.fetchTopLevelCategories();
            }*/
        }
    }

    componentDidUpdate(){
        var exercises = this.state.categoryExercises;

        if(exercises.length > 0){
            this.renderTiles();
        }else{
            this.renderCategories();
        }

    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    triggerRerender(){
        this.setState({
            triggerRerender: true
        });
    }

    async fetchTopLevelCategories(){
        
        document.getElementsByClassName("loaderBackground")[0].style.display = "flex";

        var topLevelCategories = [];
        var newIdMap = this.state.idMap;

        var classroomID = this.state.classroom.classroom_id;

        if(await this.categoriesScheduled()){

            var date = new Date();
            date = this.formatDateForRange(date);

            await fetch(baseURI + "/api/category/forDateRange/" + classroomID + "/" + date + "/" + date, {  
                method: "GET",                          
                headers: {"Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("auth_token")}
            })
            .then(res => res.text())
            .then(
                (text) => {
                    var result = text.length ? JSON.parse(text) : {};
                    topLevelCategories = result;
                }
            ).catch(console.log);
        }else{
            await fetch(baseURI + "/api/category/topLevel/" + classroomID, {  
                method: "GET",                          
                headers: {"Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("auth_token")}
            })
            .then(res => res.text())
            .then(
                (text) => {
                    var result = text.length ? JSON.parse(text) : {};
                    topLevelCategories = result;
                }
            ).catch(console.log);
        }

        newIdMap.push(topLevelCategories);

        this.setState({
            idMap: newIdMap
        });

        document.getElementsByClassName("loaderBackground")[0].style.display = "none";

    }

    async fetchCategoryChildren(category){

        document.getElementsByClassName("loaderBackground")[0].style.display = "flex";

        if(!(await this.categoryHasChildren(category.category_id))){
            await this.fetchCategoryExercises(category);
            document.getElementsByClassName("loaderBackground")[0].style.display = "none";
            return;
        }

        var newIdMap = this.state.idMap;
        var selPath = this.state.selectedPath;

        var idMapLevel = newIdMap.length;

        for(var count = 0; count < idMapLevel; count++){
            if(newIdMap[idMapLevel - 1][count].category_id === category.category_id){
                selPath.push(count);
                break;
            }
        }

        var categories = [];

        var categoryID = category.category_id;
        var classroomID = this.state.classroom.classroom_id;

        await fetch(baseURI + "/api/category/forCategory/" + classroomID + "/" + categoryID, {  
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

        newIdMap.push(categories);

        this.setState({
            idMap: newIdMap,
            selectedPath: selPath,
            currentTitle: category.title,
            categoryExercises: [],
            categoryBlobs: []
        });

        document.getElementsByClassName("loaderBackground")[0].style.display = "none";

    }

    async fetchCategoryExercises(category){
        var exercises = [];
        var exerciseBlobs = [];
        var newIdMap = this.state.idMap;

        var categoryID = category.category_id;
        var classroomID = this.state.classroom.classroom_id;

        await fetch(baseURI + "/api/exercise/forCategory/" + categoryID, {  
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

        newIdMap.push([]);

        this.setState({
            categoryExercises: exercises,
            categoryBlobs: exerciseBlobs,
            idMap: newIdMap,
            leafFolder: true
        });

    }

    /*** Render Category Tiles Section ***/
   /* async renderTopLevelCategories(){

        document.getElementsByClassName("loaderBackground")[0].style.display = "flex";

        var count = 0;
        var componentWrapper = document.getElementById("Category-componentWrapper");

        var classroomID = this.state.classroom.classroom_id;

        var numRows;
        
        componentWrapper.innerHTML = '';

        var aTile;
        var aFlexRow;
        var countOuter;
        var countInner;

        var tilesPerRow = this.calculateRowCount();
        numRows = Math.ceil(topLevelCategories.length/tilesPerRow);

        for(countOuter = 0; countOuter < numRows; countOuter++){
            
            aFlexRow = document.createElement('div');
            aFlexRow.className = "Component-Tile-Wrapper";

            for(countInner = 0; countInner < tilesPerRow; countInner++){

                aTile = ReactDom.render(this.renderCategoryRow(topLevelCategories.slice(countOuter*tilesPerRow, countOuter*tilesPerRow + tilesPerRow)), aFlexRow);
                //ReactDOM.render(aTile, aFlexRow);
            }

            componentWrapper.appendChild(aFlexRow);
        }

        

        document.getElementsByClassName("loaderBackground")[0].style.display = "none";

    }*/

    async renderCategories(){

        var newIdMap = this.state.idMap;
        var selPath = this.state.selectedPath;

       /*if(newIdMap.length > selPath.length){
            return;
        }*/

        document.getElementsByClassName("loaderBackground")[0].style.display = "flex";

        var categories = [];
        var count = 0;
        var componentWrapper = document.getElementById("Category-componentWrapper");

        categories = newIdMap[newIdMap.length - 1];  

        var numRows;

        componentWrapper.innerHTML = '';

        var aTile;
        var aFlexRow;
        var countOuter;
        var countInner;

        var tilesPerRow = this.calculateRowCount();
        numRows = Math.ceil(categories.length/tilesPerRow);

        for(countOuter = 0; countOuter < numRows; countOuter++){
            
            aFlexRow = document.createElement('div');
            aFlexRow.className = "Component-Tile-Wrapper";

            for(countInner = 0; countInner < tilesPerRow; countInner++){
                aTile = ReactDom.render(this.renderCategoryRow(categories.slice(countOuter*tilesPerRow, countOuter*tilesPerRow + tilesPerRow)), aFlexRow);
                //ReactDOM.render(aTile, aFlexRow);
            }
            componentWrapper.appendChild(aFlexRow);
        }
        
        document.getElementsByClassName("loaderBackground")[0].style.display = "none";

    }

    renderCategoryRow(categories){
        return categories.map(this.renderCategoryTile.bind(this));
    }

    renderCategoryTile(currCategory){
        return <FolderTile title={currCategory.title} tileClickEvent={e=>this.fetchCategoryChildren(currCategory)} />
    }

    /*** Render Exercise Tiles Section ***/
    async renderTiles(){
        document.getElementsByClassName("loaderBackground")[0].style.display = "flex";

        var exercises = this.state.categoryExercises;
        var exerciseBlobs = this.state.categoryBlobs;
        var count = 0;
        var componentWrapper = document.getElementById("Category-componentWrapper");

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

        document.getElementsByClassName("loaderBackground")[0].style.display = "none";

    }

    renderTileRow(exercises, blobs){
        return exercises.map(this.renderTile.bind(this, blobs));
    }

    renderTile(blobs, currExercise){

        var aImage = blobs[currExercise.exercise_id];
        var count = 0;

        return <ExerciseTile exercise={currExercise.title} image={aImage} tileClickEvent={e=>this.goToExercise(e, currExercise)} />
    }

    async searchItems(event){

        document.getElementsByClassName("loaderBackground")[0].style.display = "flex";

        var exercises = [];
        var exerciseBlobs = [];
        var count = 0;
        var componentWrapper = document.getElementById("Category-componentWrapper");
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

    async categoryHasChildren(categoryID){
        var count = 0;

        await fetch(baseURI + "/api/category/numChild/" + categoryID, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        }).then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                count = parseInt(result);
            }
        ).catch(console.log);

        if(count > 0){
            return true;
        }else{
            return false;
        }

    }

    async categoriesScheduled(){
        
        var topLevelCategories = [];

        var date = new Date();
        date = this.formatDateForRange(date);

        var classroomID = this.state.classroom.classroom_id;

        await fetch(baseURI + "/api/category/forDateRange/" + classroomID + "/" + date + "/" + date, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                topLevelCategories = result;
            }
        ).catch(console.log);

        if(topLevelCategories.length === undefined || 
            topLevelCategories.length === null || 
            topLevelCategories.length === 0){
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

    onGoToAllView(event){
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }

    goBack(){ //This isnt working, start here next time

        var newIdMap = this.state.idMap;
        var selPath = this.state.selectedPath;

        if(newIdMap.length <= 1){

            if(this.state.canGoBack){
                this.props.history.goBack();
            }

        }else if(selPath.length === 0){
            newIdMap.pop();

            this.setState({
                idMap: newIdMap,
                currentTitle: this.state.classroom.title,
                categoryExercises: [],
                categoryBlobs: []
            });
        }else{

            var idMapIndex = (selPath.length - 1); //(this.state.leafFolder ? newIdMap.length - 1 : newIdMap.length - 2);
            var selPathIndex = (selPath[selPath.length - 1]);
            var category = newIdMap[idMapIndex][selPathIndex];
            
            newIdMap.pop();
            selPath.pop();

            this.setState({
                idMap: newIdMap,
                selectedPath: selPath,
                currentTitle: category.title,
                leafFolder: false,
                categoryExercises: [],
                categoryBlobs: []
            });

        }
    }

    //Render the Header component to the DOM/Screen
    render(){

        if(!RedirectService.checkItemForUndefined(this.props.location.state)){
            return RedirectService.decideRedirect();
        }

        var classroom = this.props.location.state.classroom.title;
        //var headerTitle = (this.sa); //START HERE NEXT
        //var component = this.props.location.state.selectedComponent.title;

        return(
            <Fragment>
                {localStorage.getItem("userRole").localeCompare("STUDENT") === 0 ?
                <Header title={this.state.currentTitle} breadCrumbs={"Categories for " + this.props.location.state.classroom.title} goBack={true} customClick={this.goBack.bind(this)}/> :
                <AdminHeader title="Preview" breadCrumbs={"Preview for class " + classroom} goBack={true} customClick={this.goBack.bind(this)}/>}
                <LoadingSpinner />
                <button className="Fit4Life-Category-AllView" onClick={e => this.onGoToAllView(e)}>ALL</button>
                <div className="Category-componentContainer">
                    <Popout hist={this.props.history}/>
                    <AdminPopout hist={this.props.history}/>
                    <ConfirmToast text="Cannot access in Admin mode!"/>
                    <div className="Category-componentWrapper" id="Category-componentWrapper">
                        
                    </div>
                    <div className="Fit4Life-Category-SearchbarWrapper">
                        <div className="Fit4Life-Category-SearchElements-Wrapper">
                            <input className="Fit4Life-Category-Searchbar" disabled="true"/>
                            <button className="Fit4Life-Category-SearchButton" onClick={e => this.searchItems(e)} disabled="true">Search</button>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default CategoryView;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
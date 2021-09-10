import React, { Fragment } from 'react';
import './ScheduleManagerAdmin.css';
import './CategoryManagerAdmin.css';
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
                idMap: [[]],
                selectedPath: [],
                listIds: ["Category-Admin-List-Wrapper-0"],
                arrowIds: ["Category-Admin-List-Arrow-0"],
                view: "E",
                allExercises: [],
                scheduledExercises: [],
                allCategories: [],
                scheduledCategories: [],
                startDate: "",
                endDate: ""
            }
        }

    }

    //START HERE TOMORROW - FIGURE OUT WHY EXTRA CATEGORIES BEING ADDED AT TOP LEVEL AFTER SELECTION
    
    async componentDidMount(){ 
        await this.loadExercisesAndCategoriesForClassroom();
    }

    async componentDidUpdate(){
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
        var newIDMap = [];
        var topLevelCategories = [];

        var classroomID = this.props.location.state.classroom.classroom_id;

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

        await fetch(baseURI + "/api/category/topLevel/" + classroomID, {  
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

        for(var count = 0; count < categories.length; count++){
            topLevelCategories.push(categories[count]);
        }

        newIDMap.push(topLevelCategories);

        this.setState({
            idMap: newIDMap,
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
        
        var startDateInput = document.getElementsByClassName("Scheduler-Admin-Start-Date")[0];
        var endDateInput = document.getElementsByClassName("Scheduler-Admin-End-Date")[0];

        var startDateVal = startDateInput.value;
        var endDateVal = endDateInput.value;

        var selectedList = document.getElementsByClassName("Scheduler-Admin-List")[0];
        var allList = document.getElementsByClassName("Scheduler-Admin-AllList")[0];

        console.log(selectedList);

        while(selectedList.firstChild){
            selectedList.removeChild(selectedList.firstChild);
        }

        while(allList.firstChild){
            allList.removeChild(allList.firstChild);
        }
        
        if(startDateVal === "" || endDateVal === ""){
            return;
        }

        var allExercises = this.state.allExercises;
        var scheduledExercises = this.state.scheduledExercises;

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

    buildCategoryView(){
        var idMap = this.state.idMap;
        var selPath = this.state.selectedPath;
        var topLevel = idMap[0];
        var selectedCategories = this.state.scheduledCategories;

        var topLevelList = document.getElementById("Category-Admin-List-0");

        while(topLevelList.firstChild){
            topLevelList.removeChild(topLevelList.lastChild);
        }

        for(var count = 0; count < topLevel.length; count++){
            this.loadCategoryIntoList(0, topLevel[count].title, topLevel[count].category_id);
        }
        console.log(selPath);
        console.log(idMap);
        if(selPath.length > 0){
            document.getElementById("Category-Admin-ListItem-Wrapper-" + selPath[0] + "-" + 0).style.background = "#aa7d00";
        }

        var selectedList = document.getElementsByClassName("Scheduler-Admin-List")[0];

        while(selectedList.firstChild){
            selectedList.removeChild(selectedList.lastChild);
        }

        for(var count = 0; count < selectedCategories.length; count++){
            var selListItem = document.createElement("div");
            var titleWrapper = document.createElement("div");
            var buttonWrapper = document.createElement("div");
            var selListItemText = document.createElement("h2");
            var selListItemRemove = document.createElement("button");
            var iconDelete = document.createElement("i");

            selListItem.classList.add("Scheduler-Admin-List-Item");
            selListItem.id = "Scheduler-Admin-List-Item-" + count;

            titleWrapper.classList.add("Scheduler-Admin-List-TitleWrapper");
            titleWrapper.id = "Scheduler-Admin-List-TitleWrapper-" + count;

            buttonWrapper.classList.add("Scheduler-Admin-List-ButtonWrapper");
            buttonWrapper.id = "Scheduler-Admin-List-ButtonWrapper-" + count;

            selListItemText.classList.add("Scheduler-Admin-List-ItemText");
            selListItemText.id = "Scheduler-Admin-List-ItemText-" + count;
            selListItemText.textContent = selectedCategories[count].title;

            selListItemRemove.classList.add("Scheduler-Admin-List-ItemRemove");
            selListItemRemove.id = "Scheduler-Admin-List-ItemRemove-" + count;
            selListItemRemove.onclick = (e) => this.onCategoryRemove(e);

            iconDelete.classList.add("fa");
            iconDelete.classList.add("fa-trash");
            iconDelete.id = "Scheduler-Admin-List-IconDelete-" + count;

            selListItemRemove.appendChild(iconDelete);

            titleWrapper.appendChild(selListItemText);
            buttonWrapper.appendChild(selListItemRemove);

            selListItem.classList.add((count % 2 === 0 ? "Even" : "Odd"));

            selListItem.appendChild(titleWrapper);
            selListItem.appendChild(buttonWrapper);
            selectedList.appendChild(selListItem);
        }

    }

    /*async loadTopLevelCategories(){

        var classroomID = this.props.location.state.classroom.classroom_id;
        var categories = [];
        var newIDMap = [];
        var topLevelCategories = [];

        await fetch(baseURI + "/api/category/topLevel/" + classroomID, {  
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

        for(var count = 0; count < categories.length; count++){
            await this.loadCategoryIntoList(0, categories[count].title, categories[count].category_id);

            topLevelCategories.push(categories[count]);
        }

        newIDMap.push(topLevelCategories);

        this.setState({
            idMap: newIDMap
        });

    }*/

     loadCategoryIntoList(idNum, title, categoryID){

        var startDateInput = document.getElementsByClassName("Scheduler-Admin-Start-Date")[0];
        var endDateInput = document.getElementsByClassName("Scheduler-Admin-End-Date")[0];

        var startDateVal = startDateInput.value;
        var endDateVal = endDateInput.value;

        if(startDateVal === "" || endDateVal === ""){
            return;
        }

        var list = document.getElementById("Category-Admin-List-" + idNum);
        var childCount = list.children.length;
        var categoryWrapper = document.createElement("div");
        var categoryText = document.createElement("input");

        var idMap = this.state.idMap;
        var selPath = this.state.selectedPath;

        categoryText.classList.add("Category-Admin-ListItem");

        //categoryText.classList.add("Category-Admin-ListItem");

        categoryWrapper.classList.add("Category-Admin-ListItem-Wrapper");

        categoryWrapper.id="Category-Admin-ListItem-Wrapper-" + childCount + "-" + idNum;
        categoryText.id = "Category-Admin-ListItem-" + childCount + "-" + idNum;

        categoryWrapper.onclick = (e) => this.onSelectCategory(e);

        categoryText.value = title;
        categoryText.readOnly = true;

        categoryWrapper.appendChild(categoryText);
        list.appendChild(categoryWrapper);
    }

    clearExercises(){
        var selectedList = document.getElementsByClassName("Scheduler-Admin-List")[0];
        var allList = document.getElementsByClassName("Scheduler-Admin-AllList")[0];

        while(selectedList.firstChild){
            selectedList.removeChild(selectedList.firstChild);
        }

        while(allList.firstChild){
            allList.removeChild(allList.firstChild);
        }
    }

    clearCategories(){
        //var list = document.getElementsByClassName("Category-Admin-List-Wrapper")[0];
        //var listCount = document.getElementsByClassName("Category-Admin-List-Wrapper").length;
        var newListIds = this.state.listIds;
        var newArrowIds = this.state.arrowIds;
        var wrapper = document.getElementsByClassName("Category-Admin-Wrapper")[0];

        for(var count = 1; count < newListIds.length; count++){
            var aList = document.getElementById(newListIds[count]);
            wrapper.removeChild(aList);
        }

        newListIds.splice(1);

        for(var count = 1; count < newArrowIds.length; count++){
            var arrow = document.getElementById(newArrowIds[count]);

            if(!(arrow === null)){
                wrapper.removeChild(arrow);
            }
        }

        newArrowIds.splice(1);

        var topLevel = this.state.idMap[0];

        this.setState({
            listIds: newListIds,
            arrowIds: newArrowIds,
            idMap: [topLevel],
            selectedPath: []
        });

        /*while(list.firstChild){
            list.removeChild(list.lastChild);
        }*/
        
    }

    async onSelectCategory(event){

        var element = event.target;

        if(element.disabled === true){
            return;
        }

        var splitArr = event.target.id.split("-");

        var itemNum;
        var listNum;
        var currentList;
        //var categoryID;

        if(splitArr.length === 6){
            event.target.disabled = true;
            itemNum = parseInt(splitArr[4]);
            listNum = parseInt(splitArr[5]);
            currentList = document.getElementById("Category-Admin-List-" + listNum);
        }else{
            //idNum = parseInt(splitArr[3]);
            element.disabled = false;
            return;
        }

        for(var count = 0; count < currentList.children.length; count++){
            var listItem = currentList.children[count];
            listItem.style.background = "#7c5b00";
        }

        var wrapper = document.getElementById(event.target.id);

        var selPath = this.state.selectedPath;
        var newIDMap = this.state.idMap;
        var newListIds = this.state.listIds;
        var newArrowIds = this.state.arrowIds;

        var categoryWrapper = document.getElementsByClassName("Category-Admin-Wrapper")[0];

        for(var count = (listNum + 1); count < newListIds.length; count++){
            var list = document.getElementById(newListIds[count]);
            var arrow = document.getElementById(newArrowIds[count]);
            categoryWrapper.removeChild(list);
            categoryWrapper.removeChild(arrow);
        }

        newListIds.splice(listNum + 1);
        newArrowIds.splice(listNum + 1);

        if(selPath.length === (listNum + 1)){
            if(selPath[listNum] === itemNum){
                selPath.pop();

                if(newIDMap.length > 1){
                    newIDMap.pop();
                }

                wrapper.style.background = "#7c5b00";
                
            }else{

                selPath[listNum] = itemNum;

                await this.addListLevel((listNum + 1), newIDMap[listNum][selPath[listNum]].category_id);

                wrapper.style.background = "#aa7d00";
            }
        }else if(selPath.length < (listNum + 1)){
            selPath[listNum] = itemNum;

            await this.addListLevel((listNum + 1), newIDMap[listNum][selPath[listNum]].category_id);

            wrapper.style.background = "#aa7d00";
        }else{
            if(selPath[listNum] === itemNum){
                selPath.splice(listNum);
                newIDMap.splice(listNum + 1);

                wrapper.style.background = "#7c5b00";
            }else{
                selPath.splice(listNum + 1);
                selPath[listNum] = itemNum;
                newIDMap.splice(listNum + 1);

                await this.addListLevel((listNum + 1), newIDMap[listNum][selPath[listNum]].category_id);
           
                wrapper.style.background = "#aa7d00";
            }
        }
        console.log(newArrowIds);
        this.setState({
            selectedPath: selPath,
            listIds: newListIds,
            arrowIds: newArrowIds
        });

        element.disabled = false;

    }

    async addListLevel(listNum, parentID){

        var categoryWrapper = document.getElementsByClassName("Category-Admin-Wrapper")[0];

        var arrow = document.createElement("i");
        var listWrapper = document.createElement("div");
        var list = document.createElement("div");
        var buttonWrapper = document.createElement("div");
        var addButton = document.createElement("button");
        /*var subtractButton = document.createElement("button");
        var exerciseButton = document.createElement("button");
        var exerciseButtonIcon = document.createElement("i");*/
        console.log(list);
        var newListIds = this.state.listIds;
        var newArrowIds = this.state.arrowIds;
        var newIDMap = this.state.idMap;

        newIDMap[listNum] = [];

        arrow.classList.add("fa");
        arrow.classList.add("fa-arrow-down");
        arrow.classList.add("Category-Admin-Arrow");
        arrow.id = "Category-Admin-List-Arrow-" + listNum;

        arrow.style.fontSize = "120px";

        listWrapper.classList.add("Category-Admin-List-Wrapper");
        list.classList.add("Category-Admin-List");
        buttonWrapper.classList.add("Category-Admin-Button-Wrapper");
        addButton.classList.add("Category-Admin-Add-Button");
        /*subtractButton.classList.add("Category-Admin-Subtract-Button");
        exerciseButton.classList.add("Category-Admin-Exercise-Button");
        exerciseButtonIcon.classList.add("fa");
        exerciseButtonIcon.classList.add("fa-child");*/
        
        listWrapper.id = "Category-Admin-List-Wrapper-" + listNum;
        list.id = "Category-Admin-List-" + listNum;

        newListIds.push("Category-Admin-List-Wrapper-" + listNum);
        newArrowIds.push("Category-Admin-List-Arrow-" + listNum);

        addButton.id = "Category-Admin-Add-Button-" + listNum;
        /*subtractButton.id = "Category-Admin-Subtract-Button-" + listNum;
        exerciseButton.id = "Category-Admin-Exercise-Button-" + listNum;
        exerciseButtonIcon.id = "Category-Admin-Exercise-Icon-" + listNum;*/

        addButton.textContent = "+";
        /*subtractButton.textContent = "-";
        exerciseButton.appendChild(exerciseButtonIcon);*/

        addButton.onclick = (e) => this.onAddCategory(e);
        /*subtractButton.onclick = (e) => this.onDeleteCategory(e);
        exerciseButton.onclick = (e) => this.onAddExercises(e);*/

        //buttonWrapper.appendChild(exerciseButton);
        buttonWrapper.appendChild(addButton);
        //buttonWrapper.appendChild(subtractButton);

        listWrapper.appendChild(list);
        listWrapper.appendChild(buttonWrapper);

        categoryWrapper.appendChild(arrow);
        categoryWrapper.appendChild(listWrapper);

        if(await this.categoryHasExercise(parentID)){
            buttonWrapper.removeChild(addButton);
            await this.renderExerciseList(parentID, listNum);
            return;
        }

        await this.loadCategoriesForList(listNum, parentID);

        this.setState({
            listIds: newListIds,
            arrowsIds: newArrowIds,
            idMap: newIDMap
        });
    }

    async loadCategoriesForList(listNum, parentID){

        var classroomID = this.props.location.state.classroom.classroom_id;
        var categories = [];
        var newIDMap = this.state.idMap;

        await fetch(baseURI + "/api/category/forCategory/" + classroomID + "/" + parentID, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        }).then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                categories = result;
            }
        ).catch(console.log);

        for(var count = 0; count < categories.length; count++){
            this.loadCategoryIntoList(listNum, categories[count].title, categories[count].category_id);
            newIDMap[listNum].push(categories[count]);
        }

    }

    async renderExerciseList(categoryID, idNum){

        var categoryExercises = [];

        var startDateInput = document.getElementsByClassName("Scheduler-Admin-Start-Date")[0];
        var endDateInput = document.getElementsByClassName("Scheduler-Admin-End-Date")[0];
    
        var startDateVal = startDateInput.value;
        var endDateVal = endDateInput.value;
    
        if(startDateVal === "" || endDateVal === ""){
            return;
        }

        //Need to create this endpoint
        await fetch(baseURI + "/api/exercise/forCategory/" + categoryID, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                categoryExercises = result;
            }
        ).catch(console.log);
        
        var list = document.getElementById("Category-Admin-List-" + idNum);

        for(var count = 0; count < categoryExercises.length; count++){
            var exercise = categoryExercises[count];
    
            var childCount = list.children.length;
            var categoryWrapper = document.createElement("div");
            var categoryText = document.createElement("input");
    
            var idMap = this.state.idMap;
    
            categoryText.classList.add("Category-Admin-ListItemExerciseText");
    
            //categoryText.classList.add("Category-Admin-ListItem");
    
            categoryWrapper.classList.add("Category-Admin-ListItem-Wrapper");
    
            categoryWrapper.id="Category-Admin-ListItem-Wrapper-" + childCount + "-" + idNum;
            categoryText.id = "Category-Admin-ListItem-" + childCount + "-" + idNum;
    
            //categoryWrapper.onclick = (e) => this.onSelectCategory(e);
    
            categoryText.value = exercise.title;
            categoryText.readOnly = true;
    
            categoryWrapper.appendChild(categoryText);
            list.appendChild(categoryWrapper);

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

    async categoryHasExercise(categoryID){
        var count = 0;

        await fetch(baseURI + "/api/category/numEx/" + categoryID, {  
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

    onExerciseClick(event){
        var idNum = parseInt(event.target.id.split("-")[4]);
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
            this.clearExercises();
        }else{
            newView = "E";
            this.clearCategories();
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
            
                startDate = this.formatDateForRange(startDate);
                endDate = this.formatDateForRange(endDate);

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

        this.setState({
            startDate: startDateInput.value,
            endDate: endDateInput.value
        });
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

            startDate = this.formatDateForRange(startDate);
            endDate = this.formatDateForRange(endDate);

            if(this.state.view === "E"){
                console.log("hhhhh");
                await fetch(baseURI + "/api/exercise/forDateRange/" + classroomID + "/" + startDate + "/" + endDate, {  
                    method: "POST",                          
                    headers: {"Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("auth_token")},
                    body: JSON.stringify(this.state.scheduledExercises) //Need to add in other fields here, back end and front end
                }).catch(console.log);

            }else{

                await fetch(baseURI + "/api/category/forDateRange/" + classroomID + "/" + startDate + "/" + endDate, {  
                    method: "POST",                          
                    headers: {"Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("auth_token")},
                    body: JSON.stringify(this.state.scheduledCategories) //Need to add in other fields here, back end and front end
                }).catch(console.log);

            }

        }        

    }

    onAddCategory(event){

        var selPath = this.state.selectedPath;
        var idNum = parseInt(event.target.id.split("-")[4]);
        var newSelectedCategories = this.state.scheduledCategories;

        if(selPath.length < (idNum + 1)){
            return;
        }

        var category = this.state.idMap[idNum][selPath[idNum]];

        for(var count = 0; count < newSelectedCategories.length; count++){
            if(newSelectedCategories[count].category_id === category.category_id){
                return;
            }
        }

        newSelectedCategories.push(category);

        this.setState({
            scheduledCategories: newSelectedCategories
        });

    }

    onCategoryRemove(event){
        var idNum = event.target.id.split("-")[4];
        var newSelectedCategories = this.state.scheduledCategories;
        newSelectedCategories.splice(idNum, 1);

        this.setState({
            scheduledCategories: newSelectedCategories
        });
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
                                    <button className="Category-Admin-Add-Button" id="Category-Admin-Add-Button-0" onClick={e => this.onAddCategory(e)}>+</button>
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

/*<button className="Category-Admin-Exercise-Button" id="Category-Admin-Exercise-Button-0" onClick={e => this.onAddExercises(e)}><i class="fa fa-child" id="Category-Admin-Exercise-Icon-0"/></button>
<button className="Category-Admin-Subtract-Button" id="Category-Admin-Subtract-Button-0" onClick={e => this.onDeleteCategory(e)}>-</button>*/
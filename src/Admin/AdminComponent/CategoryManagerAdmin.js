import React, { Fragment } from 'react';
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

class CategoryManagerAdmin extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                canGoBack: true,
                idMap: [],
                selectedPath: [],
                listIds: ["Category-Admin-List-Wrapper-0"],
                arrowIds: ["Category-Admin-List-Arrow-0"]
            }
        }

    }
    
    async componentDidMount(){ 
        await this.loadTopLevelCategories();
    }

    componentWillUnmount(){
        
    }

    async loadTopLevelCategories(){

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
            this.loadCategoryIntoList(0, categories[count].title);

            topLevelCategories.push(categories[count]);
        }

        newIDMap.push(topLevelCategories);

        this.setState({
            idMap: newIDMap
        });

    }

    loadCategoryIntoList(idNum, title){
        var list = document.getElementById("Category-Admin-List-" + idNum);
        var childCount = list.children.length;
        var categoryWrapper = document.createElement("div");
        var categoryText = document.createElement("input");

        categoryWrapper.classList.add("Category-Admin-ListItem-Wrapper");
        categoryText.classList.add("Category-Admin-ListItem");

        categoryWrapper.id="Category-Admin-ListItem-Wrapper-" + childCount + "-" + idNum;
        categoryText.id = "Category-Admin-ListItem-" + childCount + "-" + idNum;

        categoryWrapper.onclick = (e) => this.onSelectCategory(e);

        categoryText.value = title;
        categoryText.onchange = (e) => this.onCategoryTitleChange(e);

        categoryWrapper.appendChild(categoryText);
        list.appendChild(categoryWrapper);
    }

    showModal(eventObj){

        var idNum = eventObj.event.target.id.split("-")[1];
        var aExercise = this.state.componentExercises[idNum];

        this.setState({
            focusedExercise: aExercise,
            focusedExerciseItemID: idNum
        });

        document.getElementById("modalContainer").style.display = "flex";
    }

    onAddExercises(event){
        var idMap = this.state.idMap;
        var selPath = this.state.selectedPath;
        var idNum = parseInt(event.target.id.split("-")[4]);

        var selectedCategory = idMap[idNum][selPath[idNum]];

        var exercises = [];
        var categoryExercises = [];

        await fetch(baseURI + "/api/exercise", {  
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

        //Need to create this endpoint
        await fetch(baseURI + "/api/exercise/forCategory/" + selectedCategory.category_id, {  
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


    }

    async onAddCategory(event){

        var element = event.target;

        if(element.disabled === true){
            return;
        }

        element.disabled = true;

        var idNum = parseInt(event.target.id.split("-")[4]);
        var list = document.getElementById("Category-Admin-List-" + idNum);
        var childCount = list.children.length;

        var aClassroom = this.props.location.state.classroom;
        var aParent = (idNum === 0 ? null : {category_id: this.state.idMap[idNum - 1][this.state.selectedPath[idNum - 1]].category_id});

        var categoryWrapper = document.createElement("div");
        var categoryText = document.createElement("input");

        categoryWrapper.classList.add("Category-Admin-ListItem-Wrapper");
        categoryText.classList.add("Category-Admin-ListItem");

        categoryWrapper.id="Category-Admin-ListItem-Wrapper-" + childCount + "-" + idNum;
        categoryText.id = "Category-Admin-ListItem-" + childCount + "-" + idNum;

        categoryWrapper.onclick = (e) => this.onSelectCategory(e);

        categoryText.value = "Category " + childCount;
        categoryText.onchange = (e) => this.onCategoryTitleChange(e);

        categoryWrapper.appendChild(categoryText);
        list.appendChild(categoryWrapper);

        var newCategory;
        var newIDMap = this.state.idMap;

        await fetch(baseURI + "/api/category", {  
            method: "POST",                          
            headers: {"Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("auth_token")},
            body: JSON.stringify({classroom: {classroom_id: aClassroom.classroom_id}, parent: aParent, title: categoryText.value})
        }).then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                newCategory = result;
            }
        )
        .catch(console.log);

        newIDMap[idNum].push(newCategory);

        this.setState({
            idMap: newIDMap
        });

        element.disabled = false;

    }

    async onDeleteCategory(event){

        var element = event.target;

        if(element.disabled === true){
            return;
        }

        element.disabled = true;

        var idNum = parseInt(event.target.id.split("-")[4]);

        var newListIds = this.state.listIds;
        var newArrowIds = this.state.arrowIds;
        var selPath = this.state.selectedPath;
        var newIDMap = this.state.idMap;

        if(idNum >= selPath.length){
            element.disabled = false;
            return;
        }

        var list = document.getElementById("Category-Admin-List-" + idNum);
        var wrapper = document.getElementsByClassName("Category-Admin-Wrapper")[0];

        for(var count = (idNum + 1); count < newListIds.length; count++){
            var aList = document.getElementById(newListIds[count]);
            var arrow = document.getElementById(newArrowIds[count]);
            wrapper.removeChild(aList);
            wrapper.removeChild(arrow);
        }

        newListIds.splice(idNum + 1);
        newArrowIds.splice(idNum + 1);

        var selectedItemNum = selPath[idNum];
        var selectedItem = document.getElementById("Category-Admin-ListItem-Wrapper-" + selectedItemNum + "-" + idNum);
        list.removeChild(selectedItem);

        for(var count = selectedItemNum; count < list.children.length; count++){
            var item = list.children[count];
            item.id = "Category-Admin-ListItem-Wrapper-" + (count) + "-" + idNum;
        }
        console.log(list.children);
        var categoryID = newIDMap[idNum][selPath[idNum]].category_id;
        newIDMap.splice(idNum + 1);
        newIDMap[idNum].splice(selPath[idNum], 1);

        selPath.splice(idNum);

        await fetch(baseURI + "/api/category/" + categoryID, {  
            method: "DELETE",                          
            headers: {"Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        }).catch(console.log);

        this.setState({
            idMap: newIDMap,
            selectedPath: selPath,
            listIds: newListIds,
            arrowsIds: newArrowIds
        });

        element.disabled = false;

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
                console.log(selPath);
                await this.addListLevel((listNum + 1), newIDMap[listNum][selPath[listNum]].category_id);

                wrapper.style.background = "#aa7d00";
            }
        }else if(selPath.length < (listNum + 1)){
            selPath[listNum] = itemNum;
            console.log(selPath);
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

        this.setState({
            selectedPath: selPath,
            listIds: newListIds,
            arrowIds: newArrowIds
        });

        element.disabled = false;
        
        //START HERE NEXT TIME - NEED TO BUILD LOGIC TO ONLY UPDATE IDMAP UNDER THE 
        //RIGHT CONDITIONS
       /* await fetch(baseURI + "/api/category/forCategory/" + , {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("auth_token")},
            body: JSON.stringify({classroom: aClassroom, parent: aParent, title: categoryText.value})
        }).catch(console.log);
        
        if(document.getElementById("Category-Admin-List-Wrapper-" + (listNum + 1)) === null){
            this.addListLevel((listNum  + 1));
        }*/
    }

    async onCategoryTitleChange(event){
        var input = event.target;
        var text = input.value;
        var splitArr = event.target.id.split("-");

        var itemNum = parseInt(splitArr[3]);
        var levelNum = parseInt(splitArr[4]);

        var idMap = this.state.idMap;

        var aCategory = idMap[levelNum][itemNum];
        aCategory.title = text;
        console.log(aCategory);
        await fetch(baseURI + "/api/category", {  
            method: "PUT",                          
            headers: {"Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("auth_token")},
            body: JSON.stringify({category_id: aCategory.category_id, classroom: {classroom_id: aCategory.classroom.classroom_id}, parent: aCategory.parent, title: aCategory.title})
        }).catch(console.log);

    }

    async addListLevel(listNum, parentID){

        var categoryWrapper = document.getElementsByClassName("Category-Admin-Wrapper")[0];

        var arrow = document.createElement("i");
        var listWrapper = document.createElement("div");
        var list = document.createElement("div");
        var buttonWrapper = document.createElement("div");
        var addButton = document.createElement("button");
        var subtractButton = document.createElement("button");
        var exerciseButton = document.createElement("button");
        var exerciseButtonIcon = document.createElement("i");

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
        subtractButton.classList.add("Category-Admin-Subtract-Button");
        exerciseButton.classList.add("Category-Admin-Exercise-Button");
        exerciseButtonIcon.classList.add("fa");
        exerciseButtonIcon.classList.add("fa-child");
        
        listWrapper.id = "Category-Admin-List-Wrapper-" + listNum;
        list.id = "Category-Admin-List-" + listNum;

        newListIds.push("Category-Admin-List-Wrapper-" + listNum);
        newArrowIds.push("Category-Admin-List-Arrow-" + listNum);

        addButton.id = "Category-Admin-Add-Button-" + listNum;
        subtractButton.id = "Category-Admin-Subtract-Button-" + listNum;
        exerciseButton.id = "Category-Admin-Exercise-Button-" + listNum;

        addButton.textContent = "+";
        subtractButton.textContent = "-";
        exerciseButton.appendChild(exerciseButtonIcon);

        addButton.onclick = (e) => this.onAddCategory(e);
        subtractButton.onclick = (e) => this.onDeleteCategory(e);
        exerciseButton.onclick = (e) => this.onAddExercises(e);

        buttonWrapper.appendChild(exerciseButton);
        buttonWrapper.appendChild(addButton);
        buttonWrapper.appendChild(subtractButton);

        listWrapper.appendChild(list);
        listWrapper.appendChild(buttonWrapper);

        categoryWrapper.appendChild(arrow);
        categoryWrapper.appendChild(listWrapper);

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
            this.loadCategoryIntoList(listNum, categories[count].title);
            newIDMap[listNum].push(categories[count]);
        }

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

    goBack(){ //This isnt working, start here next time
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }
    
    render(){

        var classroom = this.props.location.state.classroom.title;

        return(

            <div className="Category-Admin-Container">
                <AdminHeader title={"Categories"} breadCrumbs={classroom + " Categories"} goBack={true} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Delete exercise?" yesText="Yes" noText="No" onYes={e => {this.deleteExercise(); this.closeModal(); this.confirmBackendTransaction();}}/>
                <LoadingSpinner />
                <AdminPopout hist={this.props.history}/>

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
                            <button className="Category-Admin-Exercise-Button" id="Category-Admin-Exercise-Button-0" onClick={e => this.onAddExercises(e)}><i class="fa fa-child" /></button>
                            <button className="Category-Admin-Add-Button" id="Category-Admin-Add-Button-0" onClick={e => this.onAddCategory(e)}>+</button>
                            <button className="Category-Admin-Subtract-Button" id="Category-Admin-Subtract-Button-0" onClick={e => this.onDeleteCategory(e)}>-</button>
                        </div>
                    </div>
                    
                    

                </div>

            </div>
        );
            
    }
}

export default CategoryManagerAdmin;


//"react-router-dom": "^6.0.0-alpha.1",
//<div className="exerciseFiller-Admin"></div>
/*<FaArrowDown color='black' size='10rem' style={{height: "100px", width: "70px"}}/>

                    <i className="fa fa-arrow-down" style={{fontSize: "100px"}}></i> */

                    /*<div className="Category-Admin-ListItem-Wrapper">
                                <h2 className="Category-Admin-ListItem">Strength</h2>
                            </div> */
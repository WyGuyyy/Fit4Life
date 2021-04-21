import React, { Fragment } from 'react';
import './AdminComponent.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout'
import ConfirmModal from '../../Confirm/ConfirmModal';
import ConfirmToast from '../../Confirm/ConfirmToast';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { Link } from 'react-router-dom';
import {FaPen, FaRegDotCircle} from 'react-icons/fa';
import {RedirectService} from '../../_services/RedirectService';
import {baseURI} from '../../_services/APIService';

class AdminComponent extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                canGoBack: props.location.state.goBack,
                componentExercises: "",
                focusedExercise: "",
                focusedExerciseItemID: "",
                component: props.location.state.component,
                classroom: props.location.state.classroom
            }
        }

    }
    
    componentDidMount(){ 
        if(RedirectService.checkItemForUndefined(this.props.location.state)){
            this.fillExercises();
        }
    }

    componentWillUnmount(){
        
    }

    async fillExercises(){

        document.getElementsByClassName("loaderBackground")[0].style.display = "flex";

        var list = document.getElementById("exerciseList-Admin");
        var count = 0;

        var exercises = [];

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

        for(count = 0; count < exercises.length; count++){
            var listItem = document.createElement("div");
            var listItemTitle = document.createElement("h2");
            //var listStudentButton = document.createElement("button");
            var listEditButton = document.createElement("button");
            var listDeleteButton = document.createElement("button");
            var iconEdit = document.createElement("i");
            var iconDelete = document.createElement("i");

            var cell1 = document.createElement("div");
            //var cell2 = document.createElement("div");
            var cell3 = document.createElement("div");
            var cell4 = document.createElement("div");

            iconEdit.classList.add("fa");
            iconEdit.classList.add("fa-pencil");
            iconEdit.id = "iconEdit-" + count;

            iconDelete.classList.add("fa");
            iconDelete.classList.add("fa-trash");
            iconDelete.id = "iconDelete-" + count;

            listItem.classList.add("Exercise-List-Item-Admin");
            listItem.id = "exerciseListItem-" + count + "-Admin";
            //listItem.onmouseover = this.changeListItemBackground.bind(this, listItem.id);
            //listItem.onmouseleave = this.returnListItemBackground.bind(this, listItem.id);
           // listItem.onclick = (e) => this.goToClassroomComponents({event: e, id: listItem.id});

            cell1.classList.add("Exercise-Grid-Cell-Admin");
            cell1.classList.add("Exercise-Grid-Cell-Title-Admin");
            /*cell2.classList.add("Exercise-Grid-Cell-Admin");
            cell2.classList.add("Exercise-Grid-Cell-Student-Admin");*/
            cell3.classList.add("Exercise-Grid-Cell-Admin");
            cell3.classList.add("Exercise-Grid-Cell-Edit-Admin");
            cell4.classList.add("Exercise-Grid-Cell-Admin");
            cell4.classList.add("Exercise-Grid-Cell-Delete-Admin");

            listItemTitle.classList.add("Exercise-List-Item-Title-Admin");
            listItemTitle.textContent = exercises[count].title;
            listItemTitle.id = "exerciseListItemTitle-" + count + "-Admin";
            listItemTitle.title = exercises[count].title;
            //listItemTitle.onclick = (e) => this.goToClassroomComponents({event: e, id: listItem.id});

            /*listStudentButton.classList.add("Exercise-List-Item-Student-Button-Admin");
            listStudentButton.textContent = "Students";
            listStudentButton.id = "exerciseListItemStudents-" + count + "-Admin";
            listStudentButton.title = "Exercise";*/
            //listStudentButton.onclick = (e) => this.goToClassroomStudents({event: e, id: listEditButton.id});

            listEditButton.classList.add("Exercise-List-Item-Edit-Button-Admin");
            listEditButton.id = "exerciseListItemEdit-" + count + "-Admin";
            listEditButton.onclick = (e) => this.goToExerciseEdit({event: e, id: listEditButton.id});
            listEditButton.appendChild(iconEdit);
            listEditButton.title = "Edit " + listItemTitle.textContent;

            listDeleteButton.classList.add("Exercise-List-Item-Delete-Button-Admin");
            listDeleteButton.id = "exerciseListItemDelete-" + count + "-Admin";
            listDeleteButton.onclick = (e) => this.showModal({event: e, id: listDeleteButton.id});
            listDeleteButton.appendChild(iconDelete);
            listDeleteButton.title = "Delete " + listItemTitle.textContent;

            cell1.appendChild(listItemTitle);
            //cell2.appendChild(listStudentButton);
            cell3.appendChild(listEditButton);
            cell4.appendChild(listDeleteButton);

            listItem.appendChild(cell1);
            //listItem.appendChild(cell2);
            listItem.appendChild(cell3);
            listItem.appendChild(cell4);

            listItem.style.background = (count % 2 === 0 ? "#997000" : "#c08d00" );

            list.appendChild(listItem);

        }

        this.setState({
            componentExercises: exercises
        });

        document.getElementsByClassName("loaderBackground")[0].style.display = "none";

    }

    async searchExercises(event){

        document.getElementsByClassName("loaderBackground")[0].style.display = "flex";

        var list = document.getElementById("exerciseList-Admin");
        var searchText = document.getElementsByClassName("Fit4Life-Searchbar-Admin")[0].value.trim();
        var count = 0;

        var exercises = [];

        var classroomID = this.state.classroom.classroom_id;
        //var componentID = this.state.component.component_id;
        var classCompID;

        while (list.firstChild) {
            list.removeChild(list.lastChild);
        }

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

            for(var exCount = 0; exCount < exercises.length; exCount++){
                if(!exercises[exCount].title.toLowerCase().includes(searchText.toLowerCase())){
                    exercises.splice(exCount, 1);
                    exCount = exCount - 1;
                }
            }

        for(count = 0; count < exercises.length; count++){
            var listItem = document.createElement("div");
            var listItemTitle = document.createElement("h2");
            //var listStudentButton = document.createElement("button");
            var listEditButton = document.createElement("button");
            var listDeleteButton = document.createElement("button");
            var iconEdit = document.createElement("i");
            var iconDelete = document.createElement("i");

            var cell1 = document.createElement("div");
            //var cell2 = document.createElement("div");
            var cell3 = document.createElement("div");
            var cell4 = document.createElement("div");

            iconEdit.classList.add("fa");
            iconEdit.classList.add("fa-pencil");
            iconEdit.id = "iconEdit-" + count;

            iconDelete.classList.add("fa");
            iconDelete.classList.add("fa-trash");
            iconDelete.id = "iconDelete-" + count;

            listItem.classList.add("Exercise-List-Item-Admin");
            listItem.id = "exerciseListItem-" + count + "-Admin";
            //listItem.onmouseover = this.changeListItemBackground.bind(this, listItem.id);
            //listItem.onmouseleave = this.returnListItemBackground.bind(this, listItem.id);
           // listItem.onclick = (e) => this.goToClassroomComponents({event: e, id: listItem.id});

            cell1.classList.add("Exercise-Grid-Cell-Admin");
            cell1.classList.add("Exercise-Grid-Cell-Title-Admin");
            /*cell2.classList.add("Exercise-Grid-Cell-Admin");
            cell2.classList.add("Exercise-Grid-Cell-Student-Admin");*/
            cell3.classList.add("Exercise-Grid-Cell-Admin");
            cell3.classList.add("Exercise-Grid-Cell-Edit-Admin");
            cell4.classList.add("Exercise-Grid-Cell-Admin");
            cell4.classList.add("Exercise-Grid-Cell-Delete-Admin");

            listItemTitle.classList.add("Exercise-List-Item-Title-Admin");
            listItemTitle.textContent = exercises[count].title;
            listItemTitle.id = "exerciseListItemTitle-" + count + "-Admin";
            listItemTitle.title = exercises[count].title;
            //listItemTitle.onclick = (e) => this.goToClassroomComponents({event: e, id: listItem.id});

            /*listStudentButton.classList.add("Exercise-List-Item-Student-Button-Admin");
            listStudentButton.textContent = "Students";
            listStudentButton.id = "exerciseListItemStudents-" + count + "-Admin";
            listStudentButton.title = "Exercise";*/
            //listStudentButton.onclick = (e) => this.goToClassroomStudents({event: e, id: listEditButton.id});

            listEditButton.classList.add("Exercise-List-Item-Edit-Button-Admin");
            listEditButton.id = "exerciseListItemEdit-" + count + "-Admin";
            listEditButton.onclick = (e) => this.goToExerciseEdit({event: e, id: listEditButton.id});
            listEditButton.appendChild(iconEdit);
            listEditButton.title = "Edit " + listItemTitle.textContent;

            listDeleteButton.classList.add("Exercise-List-Item-Delete-Button-Admin");
            listDeleteButton.id = "exerciseListItemDelete-" + count + "-Admin";
            listDeleteButton.onclick = (e) => this.showModal({event: e, id: listDeleteButton.id});
            listDeleteButton.appendChild(iconDelete);
            listDeleteButton.title = "Delete " + listItemTitle.textContent;

            cell1.appendChild(listItemTitle);
            //cell2.appendChild(listStudentButton);
            cell3.appendChild(listEditButton);
            cell4.appendChild(listDeleteButton);

            listItem.appendChild(cell1);
            //listItem.appendChild(cell2);
            listItem.appendChild(cell3);
            listItem.appendChild(cell4);

            listItem.style.background = (count % 2 === 0 ? "#997000" : "#c08d00" );

            list.appendChild(listItem);
        }

        document.getElementsByClassName("loaderBackground")[0].style.display = "none";

    }

    changeListItemBackground(id){
        document.getElementById(id).style.background = "#bb911f";
    }

    returnListItemBackground(id){
        var classroomList = document.getElementById("exerciseList-Admin");
        this.recolorRows(classroomList);

        /*var num = id.split("-")[1];
        var backgroundColor = (parseInt(num) % 2 === 0 ? "#c08d00" : "#997000");

        document.getElementById(id).style.background = backgroundColor;*/
    }

    recolorRows(classroomList){
        var rowCount = 0;

        for(rowCount = 0; rowCount < classroomList.childNodes.length; rowCount++){
            classroomList.childNodes[rowCount].style.background = (rowCount % 2 === 0 ? "#c08d00" : "#997000");
        }
    }

    goToExerciseCreate(eventObj){

        this.props.history.push({
            pathname: "/exerciseCreateAdmin",
            state: {goBack: true, classroom: this.state.classroom, component: this.state.component}
        });
    }

    goToExerciseEdit(eventObj){

        var idNum = eventObj.event.target.id.split("-")[1];

        this.props.history.push({
            pathname: "/exerciseEditAdmin",
            state: {goBack: true, title: this.state.componentExercises[idNum].title, exercise: this.state.componentExercises[idNum], 
            classroom: this.state.classroom, component: this.state.component}
        });
    }

    /*goToClassroomComponents(eventObj){

        if(!(eventObj.event.target.classList[0].includes("Component-List-Item-Student-Button-Admin")) && !(eventObj.event.target.classList[0].includes("Component-List-Item-Edit-Button-Admin")) && !(eventObj.event.target.classList[0].includes("Component-List-Item-Delete-Button-Admin"))){
            this.props.history.push({
                pathname: "/componentAdmin",
                state: {goalID: eventObj.id, goBack: true}
            });
        }
    }*/

    async deleteExercise(eventObj){

        //var idNum = eventObj.event.target.id.split("-")[1];

        var count = 0;

        var exerciseList = document.getElementById("exerciseList-Admin");
        var listChildren = exerciseList.childNodes;

        await fetch(baseURI + "/api/exercise/" + this.state.focusedExercise.exercise_id, {  
            method: "DELETE",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        }).catch(console.log);

        for(count = 0; count < listChildren.length; count++){
            if(listChildren[count].id.localeCompare("exerciseListItem-" + this.state.focusedExerciseItemID + "-Admin") === 0){
                exerciseList.removeChild(listChildren[count]); 
                break;
            }
        }

        this.recolorRows(exerciseList);
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

        if(!RedirectService.checkItemForUndefined(this.props.location.state)){
            return RedirectService.decideRedirect();
        }

        var classroom = this.props.location.state.classroom.title;
        //var exercise = this.props.location.state.exercise.title;

        return(

            <Fragment>
                <AdminHeader title={"Exercises"} breadCrumbs={classroom + " Exercises"} goBack={false} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Delete exercise?" yesText="Yes" noText="No" onYes={e => {this.deleteExercise(); this.closeModal(); this.confirmBackendTransaction();}}/>
                <LoadingSpinner />
                <div className="homeExercise">
                    <AdminPopout hist={this.props.history}/>
                    <FaPen color='purple' size='10rem' style={{zIndex:"6", height: "20px", width: "20px"}}/>
                    <button className="Exercise-Create-Button-Admin" title="Create Exercise" onClick={(e)=>this.goToExerciseCreate({event: e})}>+</button>
                    <div className="exerciseWrapper-Admin" id="exerciseWrapper-Admin">
                        <ConfirmToast text="Exercise deleted!"/>
                        <div className="exerciseList-Admin" id="exerciseList-Admin">
                            
                            
                        </div>
                    </div>
                    <div className="Fit4Life-SearchbarWrapper-Admin">
                        <input className="Fit4Life-Searchbar-Admin"/>
                        <button className="Fit4Life-SearchButton-Admin" onClick={e => this.searchExercises(e)}>Search</button>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default AdminComponent;


//"react-router-dom": "^6.0.0-alpha.1",
//<div className="exerciseFiller-Admin"></div>
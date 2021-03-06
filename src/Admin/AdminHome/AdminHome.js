import React, { Fragment } from 'react';
import './AdminHome.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout';
import ConfirmModal from '../../Confirm/ConfirmModal';
import ConfirmToast from '../../Confirm/ConfirmToast';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { Link } from 'react-router-dom';
import {baseURI} from '../../_services/APIService';
import {authService} from '../../_services/AuthenticationService';

class AdminHome extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            canGoBack: false,
            teacherClassrooms: "",
            focusedClassroom: "",
            focusedClassroomItemID: ""
        }

    }
    
    componentDidMount(){ 
        this.fillClassrooms();
        authService.checkTokenValidity(this.props.history);
    }

    componentWillUnmount(){
        
    }

    async fillClassrooms(){

        document.getElementsByClassName("loaderBackground")[0].style.display = "flex";

        var list = document.getElementById("classroomList-Admin");
        var count = 0;

        var classrooms = [];

        await fetch(baseURI + "/api/classroom/forteacher/" + localStorage.getItem("userID"), {  
                method: "GET",                          
                headers: {"Content-Type": "application/json",
                          "Authorization": "Bearer " + localStorage.getItem("auth_token")}
            })
            .then(res => res.text())
            .then(
                (text) => {
                    var result = text.length ? JSON.parse(text) : {};
                    classrooms = result;
                }
            ).catch(console.log);

        for(count = 0; count < classrooms.length; count++){
            var listItem = document.createElement("div");
            var listItemTitle = document.createElement("h2");
            var listStudentButton = document.createElement("button");
            var listEditButton = document.createElement("button");
            var listDeleteButton = document.createElement("button");
            var listPreviewButton = document.createElement("button");
            var iconEdit = document.createElement("i");
            var iconDelete = document.createElement("i");
            var iconStudent = document.createElement("i");
            var iconPreview = document.createElement("i");

            var cell1 = document.createElement("div");
            var cell2 = document.createElement("div");
            var cell3 = document.createElement("div");
            var cell4 = document.createElement("div");
            var cell5 = document.createElement("div");

            iconEdit.classList.add("fa");
            iconEdit.classList.add("fa-pencil");
            iconEdit.id = "iconEdit-" + count;

            iconDelete.classList.add("fa");
            iconDelete.classList.add("fa-trash");
            iconDelete.id = "iconDelete-" + count;
            

            iconStudent.classList.add("fa");
            iconStudent.classList.add("fa-group");
            iconStudent.id = "iconStudent-" + count;

            iconPreview.classList.add("fa");
            iconPreview.classList.add("fa-book");
            iconPreview.id = "iconPreview-" + count;

            listItem.classList.add("Classroom-List-Item-Admin");
            listItem.id = "classroomListItem-" + count + "-Admin";
            //listItem.onmouseover = this.changeListItemBackground.bind(this, listItem.id);
            //listItem.onmouseleave = this.returnListItemBackground.bind(this, listItem.id);
            //listItem.onclick = (e) => this.goToClassroomComponents({event: e, id: listItem.id});

            cell1.classList.add("Classroom-Grid-Cell-Admin");
            cell1.classList.add("Classroom-Grid-Cell-Title-Admin");
            cell2.classList.add("Classroom-Grid-Cell-Admin");
            cell2.classList.add("Classroom-Grid-Cell-Student-Admin");
            cell3.classList.add("Classroom-Grid-Cell-Admin");
            cell3.classList.add("Classroom-Grid-Cell-Edit-Admin");
            cell4.classList.add("Classroom-Grid-Cell-Admin");
            cell4.classList.add("Classroom-Grid-Cell-Preview-Admin");
            cell5.classList.add("Classroom-Grid-Cell-Admin");
            cell5.classList.add("Classroom-Grid-Cell-Delete-Admin");

            listItemTitle.classList.add("Classroom-List-Item-Title-Admin");
            listItemTitle.textContent = classrooms[count].title;
            listItemTitle.id = "classroomListItemTitle-" + count + "-Admin";
            listItemTitle.title = classrooms[count].title;
            listItemTitle.onclick = (e) => this.goToClassroomExercises({event: e, id: listItem.id});

            listStudentButton.classList.add("Classroom-List-Item-Student-Button-Admin");
            listStudentButton.id = "classroomListItemStudents-" + count + "-Admin";
            listStudentButton.title = "Students";
            listStudentButton.onclick = (e) => this.goToClassroomStudents({event: e, id: listEditButton.id});
            listStudentButton.appendChild(iconStudent);
            listStudentButton.title = listItemTitle.textContent + " Students"

            listEditButton.classList.add("Classroom-List-Item-Edit-Button-Admin");
            listEditButton.id = "classroomListItemEdit-" + count + "-Admin";
            listEditButton.onclick = (e) => this.goToClassroomEdit({event: e, id: listEditButton.id});
            listEditButton.appendChild(iconEdit);
            listEditButton.title = "Edit " + listItemTitle.textContent;

            listDeleteButton.classList.add("Classroom-List-Item-Delete-Button-Admin");
            listDeleteButton.id = "classroomListItemDelete-" + count + "-Admin";
            listDeleteButton.onclick = (e) => this.showModal({event: e, id: listDeleteButton.id});
            listDeleteButton.appendChild(iconDelete);
            listDeleteButton.title = "Delete " + listItemTitle.textContent;

            listPreviewButton.classList.add("Classroom-List-Item-Preview-Button-Admin");
            listPreviewButton.id = "classroomListItemPreview-" + count + "-Admin";
            listPreviewButton.onclick = (e) => this.goToClassView({event: e});
            listPreviewButton.appendChild(iconPreview);
            listPreviewButton.title = "Preview " + listItemTitle.textContent;

            cell1.appendChild(listItemTitle);
            cell2.appendChild(listStudentButton);
            cell3.appendChild(listEditButton);
            cell4.appendChild(listPreviewButton);
            cell5.appendChild(listDeleteButton);

            listItem.appendChild(cell1);
            listItem.appendChild(cell2);
            listItem.appendChild(cell3);
            listItem.appendChild(cell4);
            listItem.appendChild(cell5);

            listItem.style.background = (count % 2 === 0 ? "#997000" : "#c08d00" );

            list.appendChild(listItem);

        }

        this.setState({
            teacherClassrooms: classrooms
        });

        document.getElementsByClassName("loaderBackground")[0].style.display = "none";

    }

    async searchClassrooms(){

        document.getElementsByClassName("loaderBackground")[0].style.display = "flex";

        var list = document.getElementById("classroomList-Admin");
        var count = 0;
        var searchText = document.getElementsByClassName("Fit4Life-Searchbar-Admin")[0].value.trim();

        var classrooms = [];

        while (list.firstChild) {
            list.removeChild(list.lastChild);
        }

        await fetch(baseURI + "/api/classroom/forteacher/" + localStorage.getItem("userID"), {  
                method: "GET",                          
                headers: {"Content-Type": "application/json",
                          "Authorization": "Bearer " + localStorage.getItem("auth_token")}
            })
            .then(res => res.text())
            .then(
                (text) => {
                    var result = text.length ? JSON.parse(text) : {};
                    classrooms = result;
                }
            ).catch(console.log);

            for(var count = 0; count < classrooms.length; count++){
                if(!classrooms[count].title.toLowerCase().includes(searchText.toLowerCase())){
                    classrooms.splice(count, 1);
                    count = count - 1;
                }
            }

        for(count = 0; count < classrooms.length; count++){
            var listItem = document.createElement("div");
            var listItemTitle = document.createElement("h2");
            var listStudentButton = document.createElement("button");
            var listEditButton = document.createElement("button");
            var listDeleteButton = document.createElement("button");
            var listPreviewButton = document.createElement("button");
            var iconEdit = document.createElement("i");
            var iconDelete = document.createElement("i");
            var iconStudent = document.createElement("i");
            var iconPreview = document.createElement("i");

            var cell1 = document.createElement("div");
            var cell2 = document.createElement("div");
            var cell3 = document.createElement("div");
            var cell4 = document.createElement("div");
            var cell5 = document.createElement("div");

            iconEdit.classList.add("fa");
            iconEdit.classList.add("fa-pencil");
            iconEdit.id = "iconEdit-" + count;

            iconDelete.classList.add("fa");
            iconDelete.classList.add("fa-trash");
            iconDelete.id = "iconDelete-" + count;
            

            iconStudent.classList.add("fa");
            iconStudent.classList.add("fa-group");
            iconStudent.id = "iconStudent-" + count;

            iconPreview.classList.add("fa");
            iconPreview.classList.add("fa-book");
            iconPreview.id = "iconPreview-" + count;

            listItem.classList.add("Classroom-List-Item-Admin");
            listItem.id = "classroomListItem-" + count + "-Admin";
            //listItem.onmouseover = this.changeListItemBackground.bind(this, listItem.id);
            //listItem.onmouseleave = this.returnListItemBackground.bind(this, listItem.id);
            //listItem.onclick = (e) => this.goToClassroomComponents({event: e, id: listItem.id});

            cell1.classList.add("Classroom-Grid-Cell-Admin");
            cell1.classList.add("Classroom-Grid-Cell-Title-Admin");
            cell2.classList.add("Classroom-Grid-Cell-Admin");
            cell2.classList.add("Classroom-Grid-Cell-Student-Admin");
            cell3.classList.add("Classroom-Grid-Cell-Admin");
            cell3.classList.add("Classroom-Grid-Cell-Edit-Admin");
            cell4.classList.add("Classroom-Grid-Cell-Admin");
            cell4.classList.add("Classroom-Grid-Cell-Preview-Admin");
            cell5.classList.add("Classroom-Grid-Cell-Admin");
            cell5.classList.add("Classroom-Grid-Cell-Delete-Admin");

            listItemTitle.classList.add("Classroom-List-Item-Title-Admin");
            listItemTitle.textContent = classrooms[count].title;
            listItemTitle.id = "classroomListItemTitle-" + count + "-Admin";
            listItemTitle.title = classrooms[count].title;
            listItemTitle.onclick = (e) => this.goToClassroomExercises({event: e, id: listItem.id});

            listStudentButton.classList.add("Classroom-List-Item-Student-Button-Admin");
            listStudentButton.id = "classroomListItemStudents-" + count + "-Admin";
            listStudentButton.title = "Students";
            listStudentButton.onclick = (e) => this.goToClassroomStudents({event: e, id: listEditButton.id});
            listStudentButton.appendChild(iconStudent);
            listStudentButton.title = listItemTitle.textContent + " Students"

            listEditButton.classList.add("Classroom-List-Item-Edit-Button-Admin");
            listEditButton.id = "classroomListItemEdit-" + count + "-Admin";
            listEditButton.onclick = (e) => this.goToClassroomEdit({event: e, id: listEditButton.id});
            listEditButton.appendChild(iconEdit);
            listEditButton.title = "Edit " + listItemTitle.textContent;

            listDeleteButton.classList.add("Classroom-List-Item-Delete-Button-Admin");
            listDeleteButton.id = "classroomListItemDelete-" + count + "-Admin";
            listDeleteButton.onclick = (e) => this.showModal({event: e, id: listDeleteButton.id});
            listDeleteButton.appendChild(iconDelete);
            listDeleteButton.title = "Delete " + listItemTitle.textContent;

            listPreviewButton.classList.add("Classroom-List-Item-Preview-Button-Admin");
            listPreviewButton.id = "classroomListItemPreview-" + count + "-Admin";
            listPreviewButton.onclick = (e) => this.goToClassView({event: e});
            listPreviewButton.appendChild(iconPreview);
            listPreviewButton.title = "Preview " + listItemTitle.textContent;

            cell1.appendChild(listItemTitle);
            cell2.appendChild(listStudentButton);
            cell3.appendChild(listEditButton);
            cell4.appendChild(listPreviewButton);
            cell5.appendChild(listDeleteButton);

            listItem.appendChild(cell1);
            listItem.appendChild(cell2);
            listItem.appendChild(cell3);
            listItem.appendChild(cell4);
            listItem.appendChild(cell5);

            listItem.style.background = (count % 2 === 0 ? "#997000" : "#c08d00" );

            list.appendChild(listItem);

        }

        this.setState({
            teacherClassrooms: classrooms
        });

        document.getElementsByClassName("loaderBackground")[0].style.display = "none";

    }

    changeListItemBackground(id){
        document.getElementById(id).style.background = "#bb911f";
    }

    returnListItemBackground(id){
        var classroomList = document.getElementById("classroomList-Admin");
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

    goToClassroomCreate(eventObj){

        var idNum = eventObj.event.target.id.split("-")[1];

        this.props.history.push({
            pathname: "/classroomCreateAdmin",
            state: {goBack: true}
        });
    }

    goToClassroomEdit(eventObj){

        var idNum = eventObj.event.target.id.split("-")[1];

        this.props.history.push({
            pathname: "/classroomEditAdmin",
            state: {goBack: true, classroom: this.state.teacherClassrooms[idNum]}
        });
    }

    goToClassroomExercises(eventObj){

            var idNum = eventObj.event.target.id.split("-")[1];
            var aClassroom = this.state.teacherClassrooms[idNum];

            this.props.history.push({
                pathname: "/classroomAdmin",
                state: {goalID: eventObj.id, goBack: true, classroom: aClassroom}
            });
    }

    goToClassroomStudents(eventObj){

        var idNum = eventObj.event.target.id.split("-")[1];

        this.props.history.push({
            pathname: "/studentAdmin",
            state: {goBack: true, classID: this.state.teacherClassrooms[idNum].classroom_id, classroom: this.state.teacherClassrooms[idNum]}
        });
    }

    goToClassView(eventObj){
        var idNum = eventObj.event.target.id.split("-")[1];

        this.props.history.push({
            pathname: "/classroom",
            state: {goBack: true, selectedClassroom: this.state.teacherClassrooms[idNum]}
        });
    }

    async deleteClassroom(event){

        //var idNum = eventObj.event.target.id.split("-")[1];

        var count = 0;

        var goalList = document.getElementById("classroomList-Admin");
        var listChildren = goalList.childNodes;

        await fetch(baseURI + "/api/classroom/" + this.state.focusedClassroom.classroom_id, {  
            method: "DELETE",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        }).catch(console.log);

        for(count = 0; count < listChildren.length; count++){
            if(listChildren[count].id.localeCompare("classroomListItem-" + this.state.focusedClassroomItemID + "-Admin") === 0){
                goalList.removeChild(listChildren[count]); 
                break;
            }
        }

        this.recolorRows(goalList);
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

    goBack(){ //This isnt working, start here next time
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }
    
    render(){

        return(

            <Fragment>
                <AdminHeader title="Admin Home" breadCrumbs="Admin Home" goBack={false} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Delete classroom?" yesText="Yes" noText="No" onYes={e => {this.deleteClassroom(); this.closeModal(); this.confirmBackendTransaction();}}/>
                <LoadingSpinner/>
                <div className="homeContainer">
                    <AdminPopout hist={this.props.history}/>
                    <button className="Classroom-Create-Button-Admin" title="Create Classroom" onClick={(e)=>this.goToClassroomCreate({event: e})}>+</button>
                    <div className="classroomWrapper-Admin" id="classroomWrapper-Admin">
                        <ConfirmToast text="Classroom deleted!"/>
                        <div className="classroomList-Admin" id="classroomList-Admin">
                            
                        </div>
                    </div>
                    <div className="Fit4Life-SearchbarWrapper-Admin">
                        <input className="Fit4Life-Searchbar-Admin"/>
                        <button className="Fit4Life-SearchButton-Admin" onClick={e => this.searchClassrooms(e)}>Search</button>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default AdminHome;


//"react-router-dom": "^6.0.0-alpha.1",
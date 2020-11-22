import React, { Fragment } from 'react';
import './StudentInviteAdmin.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout'
import ConfirmCreate from '../../Confirm/ConfirmCreate';
import ConfirmModal from '../../Confirm/ConfirmModal';
import ConfirmToast from '../../Confirm/ConfirmToast';
import { Link } from 'react-router-dom';
import {RedirectService} from '../../_services/RedirectService';

class StudentInviteAdmin extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                canGoBack: props.location.state.goBack,
                classroomID: props.location.state.classID,
                filteredStudents: "",
                focusedStudent: "",
                focusedStudentItemID: "",
                classroom: props.location.state.classroom
            }
        }

    }
    
    componentDidMount(){ 
        
    }

    componentWillUnmount(){
        
    }

    async fillStudents(queryString){

        var list = document.getElementById("studentInviteList-Admin");
        var count = 0;

        var matchStudents;

        for(count = 1; count < list.childNodes.length;){
            list.removeChild(list.childNodes[count]);
        }

        if(queryString.localeCompare("ALL") === 0){
            await fetch("http://localhost:8080/api/user/student", {  
                method: "GET",                          
                headers: {"Content-Type": "application/json",
                          "Authorization": "Bearer " + localStorage.getItem("auth_token")}
            })
            .then(res => res.text())
            .then(
                (text) => {
                    var result = text.length ? JSON.parse(text) : {};
                    matchStudents = result;
                }
            ).catch(console.log);
        }else{

            await fetch("http://localhost:8080/api/user/search/" + queryString, {  
                    method: "GET",                          
                    headers: {"Content-Type": "application/json",
                              "Authorization": "Bearer " + localStorage.getItem("auth_token")}
                })
                .then(res => res.text())
                .then(
                    (text) => {
                        var result = text.length ? JSON.parse(text) : {};
                        matchStudents = result;
                    }
                ).catch(console.log);

        }      

        for(count = 0; count < matchStudents.length; count++){
            var listItem = document.createElement("div");
            var listItemTitle = document.createElement("h2");
            //var listStudentButton = document.createElement("button");
            //var listEditButton = document.createElement("button");
            var listInviteButton = document.createElement("button");
            var inviteIcon = document.createElement("i");

            var cell1 = document.createElement("div");
            //var cell2 = document.createElement("div");
            //var cell3 = document.createElement("div");
            var cell4 = document.createElement("div");

            listItem.classList.add("Student-Invite-List-Item-Admin");
            listItem.id = "studentInviteListItem-" + count + "-Admin";
            //listItem.onmouseover = this.changeListItemBackground.bind(this, listItem.id);
            //listItem.onmouseleave = this.returnListItemBackground.bind(this, listItem.id);
           // listItem.onclick = (e) => this.goToClassroomComponents({event: e, id: listItem.id});

            inviteIcon.classList.add("fa");
            inviteIcon.classList.add("fa-envelope");
            inviteIcon.id = "iconInvite-" + count;

            cell1.classList.add("Student-Invite-Grid-Cell-Admin");
            cell1.classList.add("Student-Invite-Grid-Cell-Title-Admin");
            /*cell2.classList.add("Exercise-Grid-Cell-Admin");
            cell2.classList.add("Exercise-Grid-Cell-Student-Admin");*/
            /*cell3.classList.add("Student-Invite-Grid-Cell-Admin");
            cell3.classList.add("Student-Invite-Grid-Cell-Edit-Admin");*/
            cell4.classList.add("Student-Invite-Grid-Cell-Admin");
            cell4.classList.add("Student-Invite-Grid-Cell-Invite-Admin");

            listItemTitle.classList.add("Student-Invite-List-Item-Title-Admin");
            listItemTitle.textContent = matchStudents[count].email; //+ " (" + matchStudents[count].first_name + " " + matchStudents[count].last_name + ")";
            listItemTitle.id = "studentInviteListItemTitle-" + count + "-Admin";
            listItemTitle.title = matchStudents[count].email + " (" + matchStudents[count].first_name + " " + matchStudents[count].last_name + ")";
            listItemTitle.onclick = e => this.showDetailModal({event: e});

            /*listStudentButton.classList.add("Exercise-List-Item-Student-Button-Admin");
            listStudentButton.textContent = "Students";
            listStudentButton.id = "exerciseListItemStudents-" + count + "-Admin";
            listStudentButton.title = "Exercise";*/
            //listStudentButton.onclick = (e) => this.goToClassroomStudents({event: e, id: listEditButton.id});

            /*listEditButton.classList.add("Student-Invite-List-Item-Edit-Button-Admin");
            listEditButton.textContent = "Edit";
            listEditButton.id = "studentInviteListItemEdit-" + count + "-Admin";
            listEditButton.onclick = (e) => this.goToExerciseEdit({event: e, id: listEditButton.id});*/

            if(await this.isClassMember(matchStudents[count])){
                listInviteButton.classList.add("Disabled");
                listInviteButton.textContent = "Member";
                listInviteButton.id = "studentInviteListItemInvite-" + count + "-Admin";
                listInviteButton.disabled = true;
                listInviteButton.title = matchStudents[count].first_name + " " + matchStudents[count].last_name + " is already a member";
            }else if(await this.studentInviteExists(matchStudents[count])){
                listInviteButton.classList.add("Disabled");
                listInviteButton.textContent = "Invited";
                listInviteButton.id = "studentInviteListItemInvite-" + count + "-Admin";
                listInviteButton.disabled = true;
                listInviteButton.title = "Invite already sent";
            }else{
                listInviteButton.appendChild(inviteIcon);
                listInviteButton.classList.add("Student-Invite-List-Item-Invite-Button-Admin");
                listInviteButton.id = "studentInviteListItemInvite-" + count + "-Admin";
                listInviteButton.onclick = (e) => this.showModal({event: e, id: listInviteButton.id});
                listInviteButton.title = "Invite " + matchStudents[count].first_name + " " + matchStudents[count].last_name;
            }

            cell1.appendChild(listItemTitle);
            //cell2.appendChild(listStudentButton);
            //cell3.appendChild(listEditButton);
            cell4.appendChild(listInviteButton);

            listItem.appendChild(cell1);
            //listItem.appendChild(cell2);
            //listItem.appendChild(cell3);
            listItem.appendChild(cell4);

            listItem.style.background = (count % 2 === 0 ? "#997000" : "#c08d00" );

            list.appendChild(listItem);

        }

        this.setState({
            filteredStudents: matchStudents
        });

    }

    async isClassMember(student){

        var check;

        console.log("http://localhost:8080/api/user/" + this.state.classroom.classroom_id + "/" + student.user_id);

        var c = await fetch("http://localhost:8080/api/user/" + this.state.classroom.classroom_id + "/" + student.user_id, {  
                    method: "GET",                          
                    headers: {"Content-Type": "application/json",
                              "Authorization": "Bearer " + localStorage.getItem("auth_token")}
                })
                .then(res => res.text())
                .then(
                    (text) => {
                        var result = text.length ? JSON.parse(text) : null;
                        check = result;
                    }
            ).catch(console.log);

        if(check === null){
            return false;
        }else{
            return true;
        }

    }

    async studentInviteExists(student){
        var check;

        await fetch("http://localhost:8080/api/invite/" + this.state.classroom.classroom_id + "/" + student.user_id, {  
                    method: "GET",                          
                    headers: {"Content-Type": "application/json",
                              "Authorization": "Bearer " + localStorage.getItem("auth_token")}
                })
                .then(res => res.text())
                .then(
                    (text) => {
                        var result = text.length ? JSON.parse(text) : null;
                        check = result;
                    }
            ).catch(console.log);

            console.log(check);

        if(check === null){
            return false;
        }else{
            return true
        }
    }

    changeListItemBackground(id){
        document.getElementById(id).style.background = "#bb911f";
    }

    returnListItemBackground(id){
        var classroomList = document.getElementById("studentInviteList-Admin");
        this.recolorRows(classroomList);

        /*var num = id.split("-")[1];
        var backgroundColor = (parseInt(num) % 2 === 0 ? "#c08d00" : "#997000");

        document.getElementById(id).style.background = backgroundColor;*/
    }

    recolorRows(classroomList){
        var rowCount = 0;

        for(rowCount = 0; rowCount < classroomList.childNodes.length; rowCount++){
            classroomList.childNodes[rowCount].style.background = (rowCount % 2 === 0 ? "#c08d00" : "#997000");
            console.log(classroomList.childNodes[rowCount].style.background);
        }
    }

    searchStudent(eventObj){

        var queryString = document.getElementById("Student-Invite-Search-Box").value;
        queryString = (queryString.localeCompare("") === 0 ? "ALL" : queryString);

        this.fillStudents(queryString);
    }

    async inviteStudent(eventObj){

        //var idNum = eventObj.event.target.id.split("-")[1];

        var classroomID = this.state.classroomID;
        var studentID = this.state.focusedStudent.user_id;

        await fetch("http://localhost:8080/api/invite/send/" + studentID + "/" + 2 + "/" + classroomID, {  
            method: "POST",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        }).catch(console.log);

        var tempButton = document.getElementById("studentInviteListItemInvite-" + this.state.focusedStudentItemID + "-Admin");
        tempButton.classList.remove("Student-Invite-List-Item-Invite-Button-Admin");
        tempButton.classList.add("Disabled");
        tempButton.disabled = true;
        tempButton.textContent = "Invited";

    }

    /*goToExerciseCreate(eventObj){

        this.props.history.push({
            pathname: "/studentCreateAdmin",
            state: {goBack: true}
        });
    }

    goToExerciseEdit(eventObj){
        this.props.history.push({
            pathname: "/studentEditAdmin",
            state: {goBack: true}
        });
    }*/

    /*goToClassroomComponents(eventObj){

        if(!(eventObj.event.target.classList[0].includes("Component-List-Item-Student-Button-Admin")) && !(eventObj.event.target.classList[0].includes("Component-List-Item-Edit-Button-Admin")) && !(eventObj.event.target.classList[0].includes("Component-List-Item-Delete-Button-Admin"))){
            this.props.history.push({
                pathname: "/componentAdmin",
                state: {goalID: eventObj.id, goBack: true}
            });
        }
    }*/

    /*deleteExercise(eventObj){

        var idNum = eventObj.event.target.id.split("-")[1];

        var count = 0;

        var goalList = document.getElementById("studentList-Admin");
        var listChildren = goalList.childNodes;

        for(count = 0; count < listChildren.length; count++){
            if(listChildren[count].id.localeCompare("studentListItem-" + idNum + "-Admin") === 0){
                goalList.removeChild(listChildren[count]); 
                break;
            }
        }

        this.recolorRows(goalList);
    }*/

    showModal(eventObj){

        var idNum = eventObj.event.target.id.split("-")[1];
        var aStudent = this.state.filteredStudents[idNum];

        this.setState({
            focusedStudent: aStudent,
            focusedStudentItemID: idNum
        });

        document.getElementById("modalContainer").style.display = "flex";
    }

    showDetailModal(eventObj){

        var idNum = eventObj.event.target.id.split("-")[1];
        var aStudent = this.state.filteredStudents[idNum];

        this.setState({
            focusedStudent: aStudent,
            focusedStudentItemID: idNum
        });

        document.getElementById("confirmCreateText").innerHTML = "STUDENT DETAILS<br />NAME: " + 
        aStudent.first_name + " " + aStudent.last_name + "<br />EMAIL: " + 
        aStudent.email + "<br/>DISPLAY NAME: " + aStudent.display_name;
        document.getElementById("confirmCreateContainer").style.display = "flex";
    }

    closeModal(){
        document.getElementById("modalContainer").style.display = "none";
    }

    closeDetailModal(){
        document.getElementById("confirmCreateContainer").style.display = "none";
    }

    confirmBackendTransaction(){
        // Get the snackbar confirmation
        var confirmation = document.getElementById("snackbar");
        confirmation.className = "show";
        setTimeout(function(){ confirmation.className = confirmation.className.replace("show", ""); }, 3000);
    }

    goBack(){ //This isnt working, start here next time
        console.log(this.props);
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }
    
    render(){

        if(!RedirectService.checkItemForUndefined(this.props.location.state)){
            return RedirectService.decideRedirect();
        }

        var classroom = this.props.location.state.classroom.title;

        return(

            <Fragment>
                <AdminHeader title={"Invite Students"} breadCrumbs={"Invite Students to " + classroom} goBack={false} customClick={this.goBack.bind(this)}/>
                <ConfirmCreate confirm={e => {this.closeDetailModal()}} text={""} btnText={"Ok"}/>
                <ConfirmModal text="Invite student?" yesText="Yes" noText="No" onYes={e => {this.inviteStudent(); this.closeModal(); this.confirmBackendTransaction();}}/>
                <div className="studentInviteContainer-Admin">
                    <AdminPopout hist={this.props.history}/>
                    <div className="studentInviteWrapper-Admin" id="studentInviteWrapper-Admin">
                        <ConfirmToast text="Invite sent!"/>
                        <div className="studentInviteList-Admin" id="studentInviteList-Admin">
                            <div className="studentInviteFiller-Admin"></div>
                            
                        </div>
                    </div>
                </div>
                <div className="Student-Invite-Search-Area">
                        <input className="Student-Invite-Search-Box" id="Student-Invite-Search-Box" type="text" placeholder="Student Name..."/>
                        <button className="Student-Invite-Search-Button" id="Student-Invite-Search-Button" onClick={(e) => this.searchStudent(e)}>Search</button>
                </div>
            </Fragment>
        );
            
    }
}

export default StudentInviteAdmin;


//"react-router-dom": "^6.0.0-alpha.1",
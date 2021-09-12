import React, { Fragment } from 'react';
import './GroupInvite.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout'
import ConfirmCreate from '../../Confirm/ConfirmCreate';
import ConfirmModal from '../../Confirm/ConfirmModal';
import ConfirmToast from '../../Confirm/ConfirmToast';
import { Link } from 'react-router-dom';
import {RedirectService} from '../../_services/RedirectService';
import {baseURI} from '../../_services/APIService';

class GroupInvite extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                canGoBack: props.location.state.goBack,
                group: props.location.state.group,
                filteredTeachers: "",
                focusedTeacher: "",
                focusedTeacherItemID: ""
            }
        }

    }
    
    componentDidMount(){ 
        
    }

    async componentDidUpdate(){
        await this.fillTeachers();
    }

    componentWillUnmount(){
        
    }

    async fillTeachers(queryString){

        var list = document.getElementById("groupInviteList-Admin");
        var count = 0;

        var matchedTeachers = this.state.filteredTeachers;

        for(count = 1; count < list.childNodes.length;){
            list.removeChild(list.childNodes[count]);
        } 

        for(count = 0; count < matchedTeachers.length; count++){
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

            listItem.classList.add("Group-Invite-List-Item-Admin");
            listItem.id = "groupInviteListItem-" + count + "-Admin";
            //listItem.onmouseover = this.changeListItemBackground.bind(this, listItem.id);
            //listItem.onmouseleave = this.returnListItemBackground.bind(this, listItem.id);
           // listItem.onclick = (e) => this.goToClassroomComponents({event: e, id: listItem.id});

            inviteIcon.classList.add("fa");
            inviteIcon.classList.add("fa-envelope");
            inviteIcon.id = "iconInvite-" + count;

            cell1.classList.add("Group-Invite-Grid-Cell-Admin");
            cell1.classList.add("Group-Invite-Grid-Cell-Title-Admin");
            /*cell2.classList.add("Exercise-Grid-Cell-Admin");
            cell2.classList.add("Exercise-Grid-Cell-Student-Admin");*/
            /*cell3.classList.add("Student-Invite-Grid-Cell-Admin");
            cell3.classList.add("Student-Invite-Grid-Cell-Edit-Admin");*/
            cell4.classList.add("Group-Invite-Grid-Cell-Admin");
            cell4.classList.add("Group-Invite-Grid-Cell-Invite-Admin");

            listItemTitle.classList.add("Group-Invite-List-Item-Title-Admin");
            listItemTitle.textContent = matchedTeachers[count].email; //+ " (" + matchStudents[count].first_name + " " + matchStudents[count].last_name + ")";
            listItemTitle.id = "groupInviteListItemTitle-" + count + "-Admin";
            listItemTitle.title = matchedTeachers[count].email + " (" + matchedTeachers[count].first_name + " " + matchedTeachers[count].last_name + ")";
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

            if(await this.isGroupMember(matchedTeachers[count])){
                listInviteButton.classList.add("Disabled");
                listInviteButton.textContent = "Member";
                listInviteButton.id = "groupInviteListItemInvite-" + count + "-Admin";
                listInviteButton.disabled = true;
                listInviteButton.title = matchedTeachers[count].first_name + " " + matchedTeachers[count].last_name + " is already a member";
            }else if(await this.teacherInviteExists(matchedTeachers[count])){
                listInviteButton.classList.add("Disabled");
                listInviteButton.textContent = "Invited";
                listInviteButton.id = "groupInviteListItemInvite-" + count + "-Admin";
                listInviteButton.disabled = true;
                listInviteButton.title = "Invite already sent";
            }else{
                listInviteButton.appendChild(inviteIcon);
                listInviteButton.classList.add("Group-Invite-List-Item-Invite-Button-Admin");
                listInviteButton.id = "groupInviteListItemInvite-" + count + "-Admin";
                listInviteButton.onclick = (e) => this.showModal({event: e, id: listInviteButton.id});
                listInviteButton.title = "Invite " + matchedTeachers[count].first_name + " " + matchedTeachers[count].last_name;
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

    }

    //START HERE NEXT TIME AND MAKE SURE THIS ENDPOINT IS WORKING OKAY
    //THEN ENSURE THAT ALL SHARE LEVELS ARE WORKING CORRECTLY THUS FAR
    async isGroupMember(teacher){

        var check;

        var c = await fetch(baseURI + "/api/user/teacher/" + this.state.group.group_id + "/" + teacher.user_id, {  
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

    async teacherInviteExists(teacher){
        var check;

        await fetch(baseURI + "/api/groupInvite/" + this.state.group.group_id + "/" + teacher.user_id, {  
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
            return true
        }
    }

    changeListItemBackground(id){
        document.getElementById(id).style.background = "#bb911f";
    }

    returnListItemBackground(id){
        var classroomList = document.getElementById("groupInviteList-Admin");
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

    async searchTeacher(eventObj){

        var queryString = document.getElementById("Group-Invite-Search-Box").value;
        queryString = (queryString.localeCompare("") === 0 ? "ALL" : queryString);

        var matchTeachers;

        if(queryString.localeCompare("ALL") === 0){
            await fetch(baseURI + "/api/user/teacher", {  
                method: "GET",                          
                headers: {"Content-Type": "application/json",
                          "Authorization": "Bearer " + localStorage.getItem("auth_token")}
            })
            .then(res => res.text())
            .then(
                (text) => {
                    var result = text.length ? JSON.parse(text) : {};
                    matchTeachers = result;
                }
            ).catch(console.log);
        }else{

            await fetch(baseURI + "/api/user/searchTeacher/" + queryString, {  
                    method: "GET",                          
                    headers: {"Content-Type": "application/json",
                              "Authorization": "Bearer " + localStorage.getItem("auth_token")}
                })
                .then(res => res.text())
                .then(
                    (text) => {
                        var result = text.length ? JSON.parse(text) : {};
                        matchTeachers = result;
                    }
                ).catch(console.log);

        }
        
        this.setState({
            filteredTeachers: matchTeachers
        });

    }

    async inviteTeacher(eventObj){

        //var idNum = eventObj.event.target.id.split("-")[1];

        var groupID = this.state.group.group_id;
        var teacherID = this.state.focusedTeacher.user_id;
        var ownerID = localStorage.getItem("userID");

        await fetch(baseURI + "/api/groupInvite/send/" + teacherID + "/" + ownerID + "/" + groupID, {  
            method: "POST",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        }).catch(console.log);

        var tempButton = document.getElementById("groupInviteListItemInvite-" + this.state.focusedStudentItemID + "-Admin");
        tempButton.classList.remove("Group-Invite-List-Item-Invite-Button-Admin");
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
        var aTeacher = this.state.filteredTeachers[idNum];

        this.setState({
            focusedTeacher: aTeacher,
            focusedTeacherItemID: idNum
        });

        document.getElementById("confirmCreateText").innerHTML = "TEACHER DETAILS<br />NAME: " + 
        aTeacher.first_name + " " + aTeacher.last_name + "<br />EMAIL: " + 
        aTeacher.email + "<br/>DISPLAY NAME: " + aTeacher.display_name;
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
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }
    
    render(){

        if(!RedirectService.checkItemForUndefined(this.props.location.state)){
            return RedirectService.decideRedirect();
        }

        var group = this.props.location.state.group.title;

        return(

            <Fragment>
                <AdminHeader title={"Invite Teachers"} breadCrumbs={"Invite Teachers to " + group} goBack={false} customClick={this.goBack.bind(this)}/>
                <ConfirmCreate confirm={e => {this.closeDetailModal()}} text={""} btnText={"Ok"}/>
                <ConfirmModal text="Invite teacher?" yesText="Yes" noText="No" onYes={e => {this.inviteTeacher(); this.closeModal(); this.confirmBackendTransaction();}}/>
                <div className="groupInviteContainer-Admin">
                    <AdminPopout hist={this.props.history}/>
                    <div className="groupInviteWrapper-Admin" id="groupInviteWrapper-Admin">
                        <ConfirmToast text="Invite sent!"/>
                        <div className="groupInviteList-Admin" id="groupInviteList-Admin">
                            <div className="groupInviteFiller-Admin"></div>
                            
                        </div>
                    </div>
                </div>
                <div className="Group-Invite-Search-Area">
                        <input className="Group-Invite-Search-Box" id="Group-Invite-Search-Box" type="text" placeholder="Teacher Name..."/>
                        <button className="Group-Invite-Search-Button" id="Group-Invite-Search-Button" onClick={(e) => this.searchTeacher(e)}>Search</button>
                </div>
            </Fragment>
        );
            
    }
}

export default GroupInvite;


//"react-router-dom": "^6.0.0-alpha.1",
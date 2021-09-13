import React, { Fragment } from 'react';
import './GroupMember.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout';
import ConfirmModal from '../../Confirm/ConfirmModal';
import ConfirmToast from '../../Confirm/ConfirmToast';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { Link } from 'react-router-dom';
import {baseURI} from '../../_services/APIService';

class GroupMember extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            canGoBack: false,
            member: props.location.state.member,
            teacherClassrooms: "",
            focusedClassroom: "",
            focusedClassroomItemID: ""
        }

    }
    
    componentDidMount(){ 
        this.getClassrooms();
    }

    componentWillUnmount(){
        this.fillClassrooms();
    }

    async getClassrooms(){

        var classrooms = [];
        var member = this.state.member;

        await fetch(baseURI + "/api/classroom/forteacher/" + member.user_id, {  
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

            this.setState({
                teacherClassrooms: classrooms
            });

    }

    async fillClassrooms(){

        document.getElementsByClassName("loaderBackground")[0].style.display = "flex";

        var list = document.getElementById("groupMemberList-Admin");
        var count = 0;

        var classrooms = this.state.teacherClassrooms;

        for(count = 0; count < classrooms.length; count++){
            var listItem = document.createElement("div");
            var listItemTitle = document.createElement("h2");
            var listCopyButton = document.createElement("button");

            var iconCopy = document.createElement("i");

            var cell1 = document.createElement("div");
            var cell2 = document.createElement("div");

            iconCopy.classList.add("fa");
            iconCopy.classList.add("fa-copy");
            iconCopy.id = "iconCopy-" + count;

            listItem.classList.add("Classroom-List-Item-Admin");
            listItem.id = "groupMemberListItem-" + count + "-Admin";
            //listItem.onmouseover = this.changeListItemBackground.bind(this, listItem.id);
            //listItem.onmouseleave = this.returnListItemBackground.bind(this, listItem.id);
            //listItem.onclick = (e) => this.goToClassroomComponents({event: e, id: listItem.id});

            cell1.classList.add("GroupMember-Grid-Cell-Admin");
            cell1.classList.add("GroupMember-Grid-Cell-Title-Admin");
            cell2.classList.add("GroupMember-Grid-Cell-Admin");
            cell2.classList.add("GroupMember-Grid-Cell-Copy-Admin");

            listItemTitle.classList.add("GroupMember-List-Item-Title-Admin");
            listItemTitle.textContent = classrooms[count].title;
            listItemTitle.id = "groupMemberListItemTitle-" + count + "-Admin";
            listItemTitle.title = classrooms[count].title;
            listItemTitle.onclick = (e) => this.goToClassroomExercises({event: e, id: listItem.id});

            listCopyButton.classList.add("GroupMember-List-Item-Copy-Button-Admin");
            listCopyButton.id = "groupMemberListItemStudents-" + count + "-Admin";
            listCopyButton.title = "Copy";
            listCopyButton.onclick = (e) => this.copyClassroom({event: e, id: listCopyButton.id});
            listCopyButton.appendChild(iconCopy);

            cell1.appendChild(listItemTitle);
            cell2.appendChild(listCopyButton);

            listItem.appendChild(cell1);
            listItem.appendChild(cell2);

            listItem.style.background = (count % 2 === 0 ? "#997000" : "#c08d00" );

            list.appendChild(listItem);

        }

        document.getElementsByClassName("loaderBackground")[0].style.display = "none";

    }

    async searchClassrooms(){

        document.getElementsByClassName("loaderBackground")[0].style.display = "flex";

        var list = document.getElementById("groupMemberList-Admin");
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

            this.setState({
                teacherClassrooms: classrooms
            });
    
            document.getElementsByClassName("loaderBackground")[0].style.display = "none";

        /*for(count = 0; count < classrooms.length; count++){
            var listItem = document.createElement("div");
            var listItemTitle = document.createElement("h2");
            var listCopyButton = document.createElement("button");

            var iconCopy = document.createElement("i");

            var cell1 = document.createElement("div");
            var cell2 = document.createElement("div");

            iconCopy.classList.add("fa");
            iconCopy.classList.add("fa-copy");
            iconCopy.id = "iconCopy-" + count;

            listItem.classList.add("Classroom-List-Item-Admin");
            listItem.id = "classroomListItem-" + count + "-Admin";
            //listItem.onmouseover = this.changeListItemBackground.bind(this, listItem.id);
            //listItem.onmouseleave = this.returnListItemBackground.bind(this, listItem.id);
            //listItem.onclick = (e) => this.goToClassroomComponents({event: e, id: listItem.id});

            cell1.classList.add("Classroom-Grid-Cell-Admin");
            cell1.classList.add("Classroom-Grid-Cell-Title-Admin");
            cell2.classList.add("Classroom-Grid-Cell-Admin");
            cell2.classList.add("Classroom-Grid-Cell-Student-Admin");

            listItemTitle.classList.add("Classroom-List-Item-Title-Admin");
            listItemTitle.textContent = classrooms[count].title;
            listItemTitle.id = "classroomListItemTitle-" + count + "-Admin";
            listItemTitle.title = classrooms[count].title;
            listItemTitle.onclick = (e) => this.goToClassroomExercises({event: e, id: listItem.id});

            listCopyButton.classList.add("Classroom-List-Item-Student-Button-Admin");
            listCopyButton.id = "classroomListItemStudents-" + count + "-Admin";
            listCopyButton.title = "Students";
            listCopyButton.onclick = (e) => this.goToClassroomStudents({event: e, id: listCopyButton.id});
            listCopyButton.appendChild(iconCopy);
            listCopyButton.title = listItemTitle.textContent + " Students"

            cell1.appendChild(listItemTitle);
            cell2.appendChild(listCopyButton);

            listItem.appendChild(cell1);
            listItem.appendChild(cell2);

            listItem.style.background = (count % 2 === 0 ? "#997000" : "#c08d00" );

            list.appendChild(listItem);

        }*/

    }

    changeListItemBackground(id){
        document.getElementById(id).style.background = "#bb911f";
    }

    returnListItemBackground(id){
        var classroomList = document.getElementById("groupMemberList-Admin");
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
                <AdminHeader title="Classrooms" breadCrumbs="Classrooms" goBack={false} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Copy classroom?" yesText="Yes" noText="No" onYes={e => {this.deleteClassroom(); this.closeModal(); this.confirmBackendTransaction();}}/>
                <LoadingSpinner/>
                <div className="homeContainer">
                    <AdminPopout hist={this.props.history}/>
                    <div className="groupMemberWrapper-Admin" id="groupMemberWrapper-Admin">
                        <ConfirmToast text="Classroom copied!"/>
                        <div className="groupMemberList-Admin" id="groupMemberList-Admin">
                            
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

export default GroupMember;


//"react-router-dom": "^6.0.0-alpha.1",
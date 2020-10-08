import React, { Fragment } from 'react';
import './StudentInviteAdmin.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout'
import { Link } from 'react-router-dom';

class StudentInviteAdmin extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            canGoBack: props.location.state.goBack
        }

    }
    
    componentDidMount(){ 
        
    }

    componentWillUnmount(){
        
    }

    fillStudents(){

        var list = document.getElementById("studentInviteList-Admin");
        var count = 0;

        for(count = 0; count < 2; count++){
            var listItem = document.createElement("div");
            var listItemTitle = document.createElement("h2");
            //var listStudentButton = document.createElement("button");
            //var listEditButton = document.createElement("button");
            var listInviteButton = document.createElement("button");

            var cell1 = document.createElement("div");
            //var cell2 = document.createElement("div");
            //var cell3 = document.createElement("div");
            var cell4 = document.createElement("div");

            listItem.classList.add("Student-Invite-List-Item-Admin");
            listItem.id = "studentInviteListItem-" + count + "-Admin";
            listItem.onmouseover = this.changeListItemBackground.bind(this, listItem.id);
            listItem.onmouseleave = this.returnListItemBackground.bind(this, listItem.id);
           // listItem.onclick = (e) => this.goToClassroomComponents({event: e, id: listItem.id});

            cell1.classList.add("Student-Invite-Grid-Cell-Admin");
            cell1.classList.add("Student-Invite-Grid-Cell-Title-Admin");
            /*cell2.classList.add("Exercise-Grid-Cell-Admin");
            cell2.classList.add("Exercise-Grid-Cell-Student-Admin");*/
            /*cell3.classList.add("Student-Invite-Grid-Cell-Admin");
            cell3.classList.add("Student-Invite-Grid-Cell-Edit-Admin");*/
            cell4.classList.add("Student-Invite-Grid-Cell-Admin");
            cell4.classList.add("Student-Invite-Grid-Cell-Invite-Admin");

            listItemTitle.classList.add("Student-Invite-List-Item-Title-Admin");
            listItemTitle.textContent = "Student" + count;
            listItemTitle.id = "studentInviteListItemTitle-" + count + "-Admin";
            listItemTitle.title = "Student-" + count

            /*listStudentButton.classList.add("Exercise-List-Item-Student-Button-Admin");
            listStudentButton.textContent = "Students";
            listStudentButton.id = "exerciseListItemStudents-" + count + "-Admin";
            listStudentButton.title = "Exercise";*/
            //listStudentButton.onclick = (e) => this.goToClassroomStudents({event: e, id: listEditButton.id});

            /*listEditButton.classList.add("Student-Invite-List-Item-Edit-Button-Admin");
            listEditButton.textContent = "Edit";
            listEditButton.id = "studentInviteListItemEdit-" + count + "-Admin";
            listEditButton.onclick = (e) => this.goToExerciseEdit({event: e, id: listEditButton.id});*/

            listInviteButton.classList.add("Student-Invite-List-Item-Invite-Button-Admin");
            listInviteButton.textContent = "Invite";
            listInviteButton.id = "studentInviteListItemInvite-" + count + "-Admin";
            listInviteButton.onclick = (e) => this.inviteStudent({event: e, id: listInviteButton.id});

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
        this.fillStudents();
    }

    inviteStudent(eventObj){

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

    goBack(){ //This isnt working, start here next time
        console.log(this.props);
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }
    
    render(){

        return(

            <Fragment>
                <AdminHeader title="Admin Student Invite" goBack={false} customClick={this.goBack.bind(this)}/>
                <div className="studentInviteContainer-Admin">
                    <AdminPopout />
                    <div className="studentInviteWrapper-Admin" id="studentInviteWrapper-Admin">
                        <div className="studentInviteList-Admin" id="studentInviteList-Admin">
                            <div className="studentInviteFiller-Admin"></div>
                            
                        </div>
                    </div>
                </div>
                <div className="Student-Invite-Search-Area">
                        <input className="Student-Invite-Search-Box" type="text" placeholder="Student Name..."/>
                        <button className="Student-Invite-Search-Button" onClick={(e) => this.searchStudent(e)}>Search</button>
                </div>
            </Fragment>
        );
            
    }
}

export default StudentInviteAdmin;


//"react-router-dom": "^6.0.0-alpha.1",
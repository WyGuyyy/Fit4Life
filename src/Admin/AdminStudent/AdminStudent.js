import React, { Fragment } from 'react';
import './AdminStudent.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout'
import { Link } from 'react-router-dom';
import { findIconDefinition } from '@fortawesome/fontawesome-svg-core';

class AdminStudent extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            canGoBack: props.location.state.goBack
        }

    }
    
    componentDidMount(){ 
        this.fillStudents();
    }

    componentWillUnmount(){
        
    }

    fillStudents(){

        var list = document.getElementById("studentList-Admin");
        var count = 0;

        for(count = 0; count < 10; count++){
            var listItem = document.createElement("div");
            var listItemTitle = document.createElement("h2");
            //var listStudentButton = document.createElement("button");
            //var listEditButton = document.createElement("button");
            var listDeleteButton = document.createElement("button");
            var iconDrop = document.createElement("i");

            var cell1 = document.createElement("div");
            //var cell2 = document.createElement("div");
            //var cell3 = document.createElement("div");
            var cell4 = document.createElement("div");

            iconDrop.classList.add("fa");
            iconDrop.classList.add("fa-remove");
            iconDrop.id = "dropIcon-" + count;

            listItem.classList.add("Student-List-Item-Admin");
            listItem.id = "studentListItem-" + count + "-Admin";
            //listItem.onmouseover = this.changeListItemBackground.bind(this, listItem.id);
            //listItem.onmouseleave = this.returnListItemBackground.bind(this, listItem.id);
           // listItem.onclick = (e) => this.goToClassroomComponents({event: e, id: listItem.id});

            cell1.classList.add("Student-Grid-Cell-Admin");
            cell1.classList.add("Student-Grid-Cell-Title-Admin");
            /*cell2.classList.add("Exercise-Grid-Cell-Admin");
            cell2.classList.add("Exercise-Grid-Cell-Student-Admin");*/
            /*cell3.classList.add("Student-Grid-Cell-Admin");
            cell3.classList.add("Student-Grid-Cell-Edit-Admin");*/
            cell4.classList.add("Student-Grid-Cell-Admin");
            cell4.classList.add("Student-Grid-Cell-Delete-Admin");

            listItemTitle.classList.add("Student-List-Item-Title-Admin");
            listItemTitle.textContent = "Student" + count;
            listItemTitle.id = "studentListItemTitle-" + count + "-Admin";
            listItemTitle.title = "Student-" + count

            /*listStudentButton.classList.add("Exercise-List-Item-Student-Button-Admin");
            listStudentButton.textContent = "Students";
            listStudentButton.id = "exerciseListItemStudents-" + count + "-Admin";
            listStudentButton.title = "Exercise";*/
            //listStudentButton.onclick = (e) => this.goToClassroomStudents({event: e, id: listEditButton.id});

            /*listEditButton.classList.add("Student-List-Item-Edit-Button-Admin");
            listEditButton.textContent = "Edit";
            listEditButton.id = "studentListItemEdit-" + count + "-Admin";
            listEditButton.onclick = (e) => this.goToExerciseEdit({event: e, id: listEditButton.id});*/

            listDeleteButton.classList.add("Student-List-Item-Delete-Button-Admin");
            listDeleteButton.id = "studentListItemDelete-" + count + "-Admin";
            listDeleteButton.onclick = (e) => this.dropStudent({event: e, id: listDeleteButton.id});
            listDeleteButton.appendChild(iconDrop);

            cell1.appendChild(listItemTitle);
            //cell2.appendChild(listStudentButton);
            //cell3.appendChild(listEditButton);
            cell4.appendChild(listDeleteButton);

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
        var classroomList = document.getElementById("studentList-Admin");
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

    goToStudentInvite(eventObj){

        this.props.history.push({
            pathname: "/studentInviteAdmin",
            state: {goBack: true}
        });
    }

    /*goToExerciseEdit(eventObj){
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

    dropStudent(eventObj){

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
    }

    goBack(){ //This isnt working, start here next time
        console.log(this.props);
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }
    
    render(){

        return(

            <Fragment>
                <AdminHeader title="Admin Student" goBack={false} customClick={this.goBack.bind(this)}/>
                <div className="homeStudent">
                    <AdminPopout />
                    <button className="Student-InviteButton-Button-Admin" title="Student Invite" onClick={(e)=>this.goToStudentInvite({event: e})}>+</button>
                    <div className="studentWrapper-Admin" id="studentWrapper-Admin">
                        <div className="studentList-Admin" id="studentList-Admin">
                            <div className="studentFiller-Admin"></div>
                            
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default AdminStudent;


//"react-router-dom": "^6.0.0-alpha.1",
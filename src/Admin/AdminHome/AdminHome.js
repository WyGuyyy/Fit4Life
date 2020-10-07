import React, { Fragment } from 'react';
import './AdminHome.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout'
import { Link } from 'react-router-dom';

class AdminHome extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            canGoBack: false
        }

    }
    
    componentDidMount(){ 
        this.fillClassrooms();
    }

    componentWillUnmount(){
        
    }

    fillClassrooms(){

        var list = document.getElementById("classroomList-Admin");
        var count = 0;

        for(count = 0; count < 10; count++){
            var listItem = document.createElement("div");
            var listItemTitle = document.createElement("h2");
            var listStudentButton = document.createElement("button");
            var listEditButton = document.createElement("button");
            var listDeleteButton = document.createElement("button");

            var cell1 = document.createElement("div");
            var cell2 = document.createElement("div");
            var cell3 = document.createElement("div");
            var cell4 = document.createElement("div");

            listItem.classList.add("Classroom-List-Item-Admin");
            listItem.id = "classroomListItem-" + count + "-Admin";
            listItem.onmouseover = this.changeListItemBackground.bind(this, listItem.id);
            listItem.onmouseleave = this.returnListItemBackground.bind(this, listItem.id);
            listItem.onclick = (e) => this.goToClassroomComponents({event: e, id: listItem.id});

            cell1.classList.add("Classroom-Grid-Cell-Admin");
            cell1.classList.add("Classroom-Grid-Cell-Title-Admin");
            cell2.classList.add("Classroom-Grid-Cell-Admin");
            cell2.classList.add("Classroom-Grid-Cell-Student-Admin");
            cell3.classList.add("Classroom-Grid-Cell-Admin");
            cell3.classList.add("Classroom-Grid-Cell-Edit-Admin");
            cell4.classList.add("Classroom-Grid-Cell-Admin");
            cell4.classList.add("Classroom-Grid-Cell-Delete-Admin");

            listItemTitle.classList.add("Classroom-List-Item-Title-Admin");
            listItemTitle.textContent = "Classroom" + count;
            listItemTitle.id = "classroomListItemTitle-" + count + "-Admin";
            listItemTitle.title = "Classroom-" + count

            listStudentButton.classList.add("Classroom-List-Item-Student-Button-Admin");
            listStudentButton.textContent = "Students";
            listStudentButton.id = "classroomListItemStudents-" + count + "-Admin";
            listStudentButton.title = "Students";
            listStudentButton.onclick = (e) => this.goToClassroomStudents({event: e, id: listEditButton.id});

            listEditButton.classList.add("Classroom-List-Item-Edit-Button-Admin");
            listEditButton.textContent = "Edit";
            listEditButton.id = "classroomListItemEdit-" + count + "-Admin";
            listEditButton.onclick = (e) => this.goToClassroomEdit({event: e, id: listEditButton.id});

            listDeleteButton.classList.add("Classroom-List-Item-Delete-Button-Admin");
            listDeleteButton.textContent = "Delete";
            listDeleteButton.id = "classroomListItemDelete-" + count + "-Admin";
            listDeleteButton.onclick = (e) => this.deleteClassroom({event: e, id: listDeleteButton.id});

            cell1.appendChild(listItemTitle);
            cell2.appendChild(listStudentButton);
            cell3.appendChild(listEditButton);
            cell4.appendChild(listDeleteButton);

            listItem.appendChild(cell1);
            listItem.appendChild(cell2);
            listItem.appendChild(cell3);
            listItem.appendChild(cell4);

            listItem.style.background = (count % 2 === 0 ? "#997000" : "#c08d00" );

            list.appendChild(listItem);

        }

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
            console.log(classroomList.childNodes[rowCount].style.background);
        }
    }

    goToClassroomCreate(eventObj){
        this.props.history.push({
            pathname: "/classroomCreateAdmin",
            state: {goBack: true}
        });
    }

    goToClassroomEdit(eventObj){
        this.props.history.push({
            pathname: "/classroomEditAdmin",
            state: {goBack: true}
        });
    }

    goToClassroomComponents(eventObj){

        if(!(eventObj.event.target.classList[0].includes("Classroom-List-Item-Student-Button-Admin")) && !(eventObj.event.target.classList[0].includes("Classroom-List-Item-Edit-Button-Admin")) && !(eventObj.event.target.classList[0].includes("Classroom-List-Item-Delete-Button-Admin"))){
            this.props.history.push({
                pathname: "/classroomAdmin",
                state: {goalID: eventObj.id, goBack: true}
            });
        }
    }

    goToClassroomStudents(){
        this.props.history.push({
            pathname: "/studentAdmin",
            state: {goBack: true}
        });
    }

    deleteClassroom(eventObj){

        var idNum = eventObj.event.target.id.split("-")[1];

        var count = 0;

        var goalList = document.getElementById("classroomList-Admin");
        var listChildren = goalList.childNodes;

        for(count = 0; count < listChildren.length; count++){
            if(listChildren[count].id.localeCompare("classroomListItem-" + idNum + "-Admin") === 0){
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
                <AdminHeader title="Admin Home" goBack={false} customClick={this.goBack.bind(this)}/>
                <div className="homeContainer">
                    <AdminPopout />
                    <button className="Classroom-Create-Button-Admin" title="Create Classroom" onClick={(e)=>this.goToClassroomCreate({event: e})}>+</button>
                    <div className="classroomWrapper-Admin" id="classroomWrapper-Admin">
                        <div className="classroomList-Admin" id="classroomList-Admin">
                            <div className="classroomFiller-Admin"></div>
                            
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default AdminHome;


//"react-router-dom": "^6.0.0-alpha.1",
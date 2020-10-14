import React, { Fragment } from 'react';
import './AdminClassroom.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout'
import { Link } from 'react-router-dom';

class AdminClassroom extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            canGoBack: props.location.state.goBack,
            classroomComponents: ""
        }

    }
    
    componentDidMount(){ 
        this.fillComponents();
    }

    componentWillUnmount(){
        
    }

    async fillComponents(){

        var list = document.getElementById("componentList-Admin");
        var count = 0;

        var components;

        await fetch("http://localhost:8080/api/component", {  
                method: "GET",                          
                headers: {"Content-Type": "application/json"}
            })
            .then(res => res.text())
            .then(
                (text) => {
                    var result = text.length ? JSON.parse(text) : {};
                    components = result;
                }
            ).catch(console.log);

        for(count = 0; count < components.length; count++){
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

            listItem.classList.add("Component-List-Item-Admin");
            listItem.id = "componentListItem-" + count + "-Admin";
            //listItem.onmouseover = this.changeListItemBackground.bind(this, listItem.id);
            //listItem.onmouseleave = this.returnListItemBackground.bind(this, listItem.id);
            //listItem.onclick = (e) => this.goToClassroomComponents({event: e, id: listItem.id});

            cell1.classList.add("Component-Grid-Cell-Admin");
            cell1.classList.add("Component-Grid-Cell-Title-Admin");
            /*cell2.classList.add("Component-Grid-Cell-Admin");
            cell2.classList.add("Component-Grid-Cell-Student-Admin");*/
            cell3.classList.add("Component-Grid-Cell-Admin");
            cell3.classList.add("Component-Grid-Cell-Edit-Admin");
            cell4.classList.add("Component-Grid-Cell-Admin");
            cell4.classList.add("Component-Grid-Cell-Delete-Admin");

            listItemTitle.classList.add("Component-List-Item-Title-Admin");
            listItemTitle.textContent = components[count].title;
            listItemTitle.id = "componentListItemTitle-" + count + "-Admin";
            listItemTitle.title = components[count].title;
            listItemTitle.onclick = (e) => this.goToClassroomComponents({event: e, id: listItem.id});

            /*listStudentButton.classList.add("Component-List-Item-Student-Button-Admin");
            listStudentButton.textContent = "Students";
            listStudentButton.id = "componentListItemStudents-" + count + "-Admin";
            listStudentButton.title = "Students";
            listStudentButton.onclick = (e) => this.goToClassroomStudents({event: e, id: listEditButton.id});*/

            listEditButton.classList.add("Component-List-Item-Edit-Button-Admin");
            listEditButton.id = "componentListItemEdit-" + count + "-Admin";
            listEditButton.onclick = (e) => this.goToClassroomEdit({event: e, id: listEditButton.id});
            listEditButton.appendChild(iconEdit);
            listEditButton.title = "Edit " + listItemTitle.textContent;
            
            listDeleteButton.classList.add("Component-List-Item-Delete-Button-Admin");
            listDeleteButton.id = "componentListItemDelete-" + count + "-Admin";
            listDeleteButton.onclick = (e) => this.deleteClassroom({event: e, id: listDeleteButton.id});
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
            classroomComponents: components
        });

    }

    changeListItemBackground(id){
        document.getElementById(id).style.background = "#bb911f";
    }

    returnListItemBackground(id){
        var classroomList = document.getElementById("componentList-Admin");
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
            pathname: "/componentCreateAdmin",
            state: {goBack: true}
        });
    }

    goToClassroomEdit(eventObj){

        var idNum = eventObj.event.target.id.split("-")[1];

        this.props.history.push({
            pathname: "/componentEditAdmin",
            state: {goBack: true, title: this.state.classroomComponents[idNum].title}
        });
    }

    goToClassroomComponents(eventObj){

        if(!(eventObj.event.target.classList[0].includes("Component-List-Item-Student-Button-Admin")) && !(eventObj.event.target.classList[0].includes("Component-List-Item-Edit-Button-Admin")) && !(eventObj.event.target.classList[0].includes("Component-List-Item-Delete-Button-Admin"))){
            this.props.history.push({
                pathname: "/componentAdmin",
                state: {goalID: eventObj.id, goBack: true}
            });
        }
    }

    async deleteClassroom(eventObj){

        var idNum = eventObj.event.target.id.split("-")[1];

        var count = 0;

        var goalList = document.getElementById("componentList-Admin");
        var listChildren = goalList.childNodes;

        await fetch("http://localhost:8080/api/component/" + this.state.classroomComponents[idNum].component_id, {  
            method: "DELETE",                          
            headers: {"Content-Type": "application/json"}
        }).catch(console.log);

        for(count = 0; count < listChildren.length; count++){
            if(listChildren[count].id.localeCompare("componentListItem-" + idNum + "-Admin") === 0){
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
                <AdminHeader title="Admin Component" goBack={false} customClick={this.goBack.bind(this)}/>
                <div className="homeComponent">
                    <AdminPopout />
                    <button className="Component-Create-Button-Admin" title="Create Component" onClick={(e)=>this.goToClassroomCreate({event: e})}>+</button>
                    <div className="componentWrapper-Admin" id="componentWrapper-Admin">
                        <div className="componentList-Admin" id="componentList-Admin">
                            <div className="componentFiller-Admin"></div>
                            
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default AdminClassroom;


//"react-router-dom": "^6.0.0-alpha.1",
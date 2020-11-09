import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './Goal.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout'
import ConfirmModal from '../Confirm/ConfirmModal';
import ConfirmToast from '../Confirm/ConfirmToast';
import { Link } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

class Goal extends React.Component{
    constructor(props){
        super(props);

        this.state = {
           canGoBack: props.location.state.goBack,
           userGoals: ""
        };

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
        this.fillGoals();
    }

    componentDidUpdate(){

    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    async fillGoals(){

        var list = document.getElementById("goalList");
        var count = 0;

        var goals = [];

        await fetch("http://localhost:8080/api/goal/byUser/" + localStorage.getItem("userID"), {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                goals = result;
            }
        ).catch(console.log);

        console.log(goals);

        for(count = 0; count < goals.length; count++){
            var listItem = document.createElement("div");
            var listItemTitle = document.createElement("h2");
            var listItemProgress = document.createElement("h2");
            var listEditButton = document.createElement("button");
            var listDeleteButton = document.createElement("button");
            var iconEdit = document.createElement("i");
            var iconDelete = document.createElement("i");

            var cell1 = document.createElement("div");
            var cell2 = document.createElement("div");
            var cell3 = document.createElement("div");
            var cell4 = document.createElement("div");

            iconEdit.classList.add("fa");
            iconEdit.classList.add("fa-pencil");
            iconEdit.id = "iconEdit-" + count;

            iconDelete.classList.add("fa");
            iconDelete.classList.add("fa-trash");
            iconDelete.id = "iconDelete-" + count;

            listItem.classList.add("Goal-List-Item");
            listItem.id = "goalListItem-" + count;
            //listItem.onmouseover = this.changeListItemBackground.bind(this, listItem.id);
            //listItem.onmouseleave = this.returnListItemBackground.bind(this, listItem.id);
            //listItem.onclick = (e) => this.goToGoalDetails({event: e, id: listItem.id});

            cell1.classList.add("Goal-Grid-Cell");
            cell1.classList.add("Goal-Grid-Cell-Title");
            cell2.classList.add("Goal-Grid-Cell");
            cell2.classList.add("Goal-Grid-Cell-Progress");
            cell3.classList.add("Goal-Grid-Cell");
            cell3.classList.add("Goal-Grid-Cell-Edit");
            cell4.classList.add("Goal-Grid-Cell");
            cell4.classList.add("Goal-Grid-Cell-Delete");

            listItemTitle.classList.add("Goal-List-Item-Title");
            listItemTitle.textContent = goals[count].title;
            listItemTitle.id = "goalListItemTitle-" + count;
            listItemTitle.title = goals[count].title;
            listItemTitle.onclick = (e) => this.goToGoalDetails({event: e, id: listItem.id});

            listItemProgress.classList.add("Goal-List-Item-Progress");
            listItemProgress.textContent = goals[count].progress;
            listItemProgress.id = "goalListItemProgress-" + count;
            listItemProgress.title = goals[count].progress;
            
            if(listItemProgress.textContent.localeCompare("Not Started") === 0){
                listItemProgress.style.color = "#ff0000";
            }else if(listItemProgress.textContent.localeCompare("In Progress") === 0){
                listItemProgress.style.color = "#fbff00";
            }else{
                listItemProgress.style.color = "#2bff00";
            }

            listEditButton.classList.add("Goal-List-Item-Edit-Button");
            listEditButton.id = "goalListItemEdit-" + count;
            listEditButton.onclick = (e) => this.goToGoalEdit({event: e, id: listEditButton.id});
            listEditButton.appendChild(iconEdit);
            listEditButton.title = "Edit " + listItemTitle.textContent;

            listDeleteButton.classList.add("Goal-List-Item-Delete-Button");
            listDeleteButton.id = "goalListItemDelete-" + count;
            listDeleteButton.onclick = (e) => this.showModal({event: e, id: listDeleteButton.id});
            listDeleteButton.appendChild(iconDelete);
            listDeleteButton.title = "Delete " + listItemTitle.textContent;

            cell1.appendChild(listItemTitle);
            cell2.appendChild(listItemProgress);
            cell3.appendChild(listEditButton);
            cell4.appendChild(listDeleteButton);

            listItem.appendChild(cell1);
            listItem.appendChild(cell2);
            listItem.appendChild(cell3);
            listItem.appendChild(cell4);

            listItem.style.background = (count % 2 === 0 ? "#997000" : "#c08d00" );

            list.appendChild(listItem);

        }

        this.setState({
            userGoals: goals
        });

    }

    changeListItemBackground(id){
        document.getElementById(id).style.background = "#bb911f";
    }

    returnListItemBackground(id){
        var goalList = document.getElementById("goalList");
        this.recolorRows(goalList);

        /*var num = id.split("-")[1];
        var backgroundColor = (parseInt(num) % 2 === 0 ? "#c08d00" : "#997000");

        document.getElementById(id).style.background = backgroundColor;*/
    }

    goToGoalDetails(eventObj){

        var idNum = eventObj.event.target.id.split("-")[1];
        var selectedGoal = this.state.userGoals[idNum];

        if(!(eventObj.event.target.classList[0].includes("Goal-List-Item-Edit-Button")) && !(eventObj.event.target.classList[0].includes("Goal-List-Item-Delete-Button"))){
            this.props.history.push({
                pathname: "/goalDetail",
                state: {goal: selectedGoal, goBack: true}
            });
        }
     
    }

    goToGoalEdit(eventObj){

        var idNum = eventObj.event.target.id.split("-")[1];
        var selectedGoal = this.state.userGoals[idNum];

        this.props.history.push({
            pathname: "/goalEdit",
            state: {goal: selectedGoal, goBack: true}
        });
    }

    goToGoalCreate(eventObj){
        this.props.history.push({
            pathname: "/goalCreate",
            state: {goBack: true}
        });
    }

    async deleteGoal(eventObj){
        //var idNum = eventObj.event.target.id.split("-")[1];
        //var idNum = eventObj.event.target.id.split("-")[1];

        var count = 0;

        var goalList = document.getElementById("goalList");
        var listChildren = goalList.childNodes;

        await fetch("http://localhost:8080/api/goal/" + this.state.focusedGoal.goal_id, {  
            method: "DELETE",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        }).catch(console.log);

        for(count = 0; count < listChildren.length; count++){
            if(listChildren[count].id.localeCompare("goalListItem-" + this.state.focusedGoalItemID) === 0){
                goalList.removeChild(listChildren[count]); 
                break;
            }
        }

        this.recolorRows(goalList);
    }

    recolorRows(goalList){
        var rowCount = 0;

        for(rowCount = 0; rowCount < goalList.childNodes.length; rowCount++){
            goalList.childNodes[rowCount].style.background = (rowCount % 2 === 0 ? "#c08d00" : "#997000");
            console.log(goalList.childNodes[rowCount].style.background);
        }
    }

    showModal(eventObj){

        var idNum = eventObj.event.target.id.split("-")[1];
        var aGoal = this.state.userGoals[idNum];

        this.setState({
            focusedGoal: aGoal,
            focusedGoalItemID: idNum
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

    //Render the Header component to the DOM/Screen
    render(){

        return(
            <Fragment>
                <Header title="Goals" breadCrumbs="Goals" goBack={true} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Delete goal?" yesText="Yes" noText="No" onYes={e => {this.deleteGoal(); this.closeModal(); this.confirmBackendTransaction();}} />
                <div className="goalContainer">
                    <Popout hist={this.props.history}/>
                    <button className="Goal-Create-Button" title="Create Goal" onClick={(e)=>this.goToGoalCreate({event: e})}>+</button>
                    <div className="goalWrapper" id="goalWrapper">
                        <ConfirmToast text="Goal deleted!"/>
                        <div className="goalList" id="goalList">
                            <div className="goalFiller"></div>
                            
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default Goal;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
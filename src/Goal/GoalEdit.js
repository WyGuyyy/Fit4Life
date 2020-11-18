import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './GoalEdit.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout'
import ConfirmModal from '../Confirm/ConfirmModal';
import ConfirmToast from '../Confirm/ConfirmToast';
import { Link } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import {RedirectService} from '../_services/RedirectService';

class GoalEdit extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                canGoBack: props.location.state.goBack,
                goal: props.location.state.goal
            };
        }

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 

    }

    componentDidUpdate(){

    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    async editGoal(event){

        console.log("ran");

        var goalID = this.state.goal.goal_id;
        var aTitle = document.getElementById("Goal-Edit-Title-Input").value;
        var aProgress = (document.getElementById("notStarted").checked ? "Not Started" : 
        (document.getElementById("inProgress").checked ? "In Progress" : "Complete"));
        var aDescription = document.getElementById("Goal-Edit-Description-TextArea").value;

        await fetch("http://localhost:8080/api/goal", {  
            method: "PUT",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")},
            body: JSON.stringify({goal_id: goalID, user: {user_id: 1}, title: aTitle, progress: aProgress, content: aDescription}) //Need to add in other fields here, back end and front end
        }).catch(console.log);

        //document.getElementById("modalContainer").style.display = "none";

        // Get the snackbar confirmation
        /*var confirmation = document.getElementById("snackbar");
        confirmation.className = "show";
        setTimeout(function(){ confirmation.className = confirmation.className.replace("show", ""); }, 3000);*/

        /*document.getElementById("Goal-Edit-Title-Input").value = "";
        document.getElementById("notStarted").checked = false;
        document.getElementById("inProgress").checked = false;
        document.getElementById("complete").checked = false;
        document.getElementById("Goal-Edit-Description-TextArea").value = "";*/

    }

    showModal(event){
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

        if(!RedirectService.checkItemForUndefined(this.props.location.state)){
            return RedirectService.decideRedirect();
        }

        var title = this.props.location.state.goal.title;
        var progress = this.props.location.state.goal.progress;
        var content = this.props.location.state.goal.content;
        //var progressColor = (progress.localeCompare("NOT STARTED") === 0 ? "#ff0000" : (progress.localeCompare("IN PROGRESS") === 0 ? "#fbff00" : "#2bff00"));

        return(
            <Fragment>
                <Header title="Goal Edit" breadCrumbs="Goal Edit" goBack={true} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Save goal?" yesText="Yes" noText="No" onYes={e => {this.editGoal(e); this.closeModal(); this.confirmBackendTransaction();}}/>
                <div className="Goal-Edit-Container">
                    <Popout hist={this.props.history}/>
                    <div className="Goal-Edit-Wrapper">
                        <ConfirmToast text="Goal saved!"/>
                        <div className="Goal-Edit-Form-Wrapper">
                            <div className="Goal-Edit-Title-Wrapper">
                                <label className="Goal-Edit-Title-Label">Title: </label> <input className="Goal-Edit-Title-Input" id="Goal-Edit-Title-Input" placeholder="Title..." defaultValue={title} maxLength="50"/>
                            </div>
                            <div className="Goal-Edit-Progress-Wrapper">
                                <label className="Goal-Edit-Progress-Label">Progress: </label> 
                                <div className="Goal-Edit-Radio-Wrapper">
                                    <div className="Goal-Edit-Not-Started-Radio-Wrapper">
                                        <input className="Goal-Edit-Not-Started-Radio" type="radio" id="notStarted" name="progress" value="not-started" defaultChecked={(progress.localeCompare("Not Started") === 0 ? true : false)}/>
                                        <label className="Goal-Edit-Not-Started-Label" for="notStarted">Not Started</label>
                                    </div>

                                    <div className="Goal-Edit-In-Progress-Radio-Wrapper">
                                        <input className="Goal-Edit-In-Progress-Radio" type="radio" id="inProgress" name="progress" value="in-progress" defaultChecked={(progress.localeCompare("In Progress") === 0 ? true : false)}/>
                                        <label className="Goal-Edit-In-Progress-Label" for="inProgress">In Progress</label>
                                    </div>

                                    <div className="Goal-Edit-Complete-Radio-Wrapper">
                                        <input className="Goal-Edit-Complete-Radio" type="radio" id="complete" name="progress" value="complete" defaultChecked={(progress.localeCompare("Complete") === 0 ? true : false)}/>
                                        <label className="Goal-Edit-Complete-Label" for="complete">Complete</label>
                                    </div>
                                </div>
                            </div>
                            <div className="Goal-Edit-Description-Wrapper">
                                <label className="Goal-Edit-Description-Label">Description: </label> <textarea className="Goal-Edit-Description-TextArea" id="Goal-Edit-Description-TextArea" placeholder="Description..." defaultValue={content}/>
                            </div>
                            <div className="Goal-Edit-Submit-Wrapper">
                                <button className="Goal-Edit-Submit-Button" onClick={(e) => this.showModal(e)}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default GoalEdit;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
/*<div className="Goal-Detail-Title-Wrapper">
                            <label className="Goal-Detail-Title-Label">Goal Title: </label> <input className="Goal-Detail-Title-Input" type="text"/>
                        </div>
                        <div className="Goal-Detail-Progress-Wrapper">
                            <label className="Goal-Detail-Progress-Label">Goal Progress: </label> <input className="Goal-Detail-Progress-Input" type="text"/>
                        </div>
                        <div className="Goal-Detail-Description-Wrapper">
                            <label className="Goal-Detail-Description-Label">Goal Detail: </label> <input className="Goal-Detail-Description-Input" type="text"/>
                        </div>*/
import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './Invite.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout';
import ConfirmModal from '../Confirm/ConfirmModal';
import ConfirmToast from '../Confirm/ConfirmToast';
import { Link } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

class Invite extends React.Component{
    constructor(props){
        super(props);

        this.state = {
           canGoBack: props.location.state.goBack,
           userInvites: ""
        };

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
        this.fillInvites();
    }

    componentDidUpdate(){

    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    async fillInvites(){

        var list = document.getElementById("inviteList");
        var count = 0;

        var invites;
        var classroomTitle;
        var teacherLastName;

        await fetch("http://localhost:8080/api/invite", {  
            method: "GET",                          
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                invites = result;
            }
        ).catch(console.log);

        for(count = 0; count < invites.length; count++){
            var listItem = document.createElement("div");
            var listItemTitle = document.createElement("h2");
            var listItemProfessor = document.createElement("h2");
            var listAcceptButton = document.createElement("button");
            var listDeclineButton = document.createElement("button");
            var iconAccept = document.createElement("i");
            var iconDecline = document.createElement("i");

            var cell1 = document.createElement("div");
            var cell2 = document.createElement("div");
            var cell3 = document.createElement("div");
            var cell4 = document.createElement("div");

            classroomTitle = await this.getInviteClassroom(invites[count].classroom.classroom_id);
            teacherLastName = await this.getInviteTeacher(invites[count].teacher.user_id);

            iconAccept.classList.add("fa");
            iconAccept.classList.add("fa-check");
            iconAccept.id = "iconAccept-" + count;

            iconDecline.classList.add("fa");
            iconDecline.classList.add("fa-remove");
            iconDecline.id = "iconDecline-" + count;

            listItem.classList.add("Invite-List-Item");
            listItem.id = "inviteListItem-" + count;
            //listItem.onmouseover = this.changeListItemBackground.bind(this, listItem.id);
            //listItem.onmouseleave = this.returnListItemBackground.bind(this, listItem.id);

            cell1.classList.add("Invite-Grid-Cell");
            cell1.classList.add("Invite-Grid-Cell-Title");
            cell2.classList.add("Invite-Grid-Cell");
            cell2.classList.add("Invite-Grid-Cell-Teacher");
            cell3.classList.add("Invite-Grid-Cell");
            cell3.classList.add("Invite-Grid-Cell-Accept");
            cell4.classList.add("Invite-Grid-Cell");
            cell4.classList.add("Invite-Grid-Cell-Decline");

            listItemTitle.classList.add("Invite-List-Item-Title");
            listItemTitle.textContent = classroomTitle;
            listItemTitle.id = "inviteListItemTitle-" + count;
            listItemTitle.title = "Classroom" + count

            listItemProfessor.classList.add("Invite-List-Item-Teacher");
            listItemProfessor.textContent = "Professor " + teacherLastName;
            listItemProfessor.id = "inviteListItemTeacher-" + count;
            listItemProfessor.title = "Professor Towne";

            listAcceptButton.classList.add("Invite-List-Item-Accept-Button");
            listAcceptButton.id = "inviteListItemEdit-" + count;
            listAcceptButton.onclick = (e) => this.acceptInvite({event: e, id: listAcceptButton.id});
            listAcceptButton.appendChild(iconAccept);
            listAcceptButton.title = "Accept Invitation";

            listDeclineButton.classList.add("Invite-List-Item-Decline-Button");
            listDeclineButton.id = "inviteListItemDecline-" + count;
            listDeclineButton.onclick = (e) => this.declineInvite({event: e, id: listDeclineButton.id});
            listDeclineButton.appendChild(iconDecline);
            listDeclineButton.title = "Decline Invitation";

            cell1.appendChild(listItemTitle);
            cell2.appendChild(listItemProfessor);
            cell3.appendChild(listAcceptButton);
            cell4.appendChild(listDeclineButton);

            listItem.appendChild(cell1);
            listItem.appendChild(cell2);
            listItem.appendChild(cell3);
            listItem.appendChild(cell4);

            listItem.style.background = (count % 2 === 0 ? "#997000" : "#c08d00" );

            list.appendChild(listItem);

        }

        this.setState({
            userInvites: invites
        });

    }

    async getInviteClassroom(cID){
        var classroomTitle;

        await fetch("http://localhost:8080/api/classroom/" + cID, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                classroomTitle = result.title;
            }
        ).catch(console.log);

        return classroomTitle;
    }

    async getInviteTeacher(tID){
        var teacherLastName;

        await fetch("http://localhost:8080/api/user/" + tID, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                teacherLastName = result.last_name;
            }
        ).catch(console.log);

        return teacherLastName;
    }

    changeListItemBackground(id){
        document.getElementById(id).style.background = "#bb911f";
    }

    returnListItemBackground(id){
        var goalList = document.getElementById("inviteList");
        this.recolorRows(goalList);

        /*var num = id.split("-")[1];
        var backgroundColor = (parseInt(num) % 2 === 0 ? "#c08d00" : "#997000");

        document.getElementById(id).style.background = backgroundColor;*/
    }

    recolorRows(goalList){
        var rowCount = 0;

        for(rowCount = 0; rowCount < goalList.childNodes.length; rowCount++){
            goalList.childNodes[rowCount].style.background = (rowCount % 2 === 0 ? "#c08d00" : "#997000");
            console.log(goalList.childNodes[rowCount].style.background);
        }
    }

    async declineInvite(eventObj){
        var idNum = eventObj.event.target.id.split("-")[1];

        var count = 0;

        var inviteList = document.getElementById("inviteList");
        var listChildren = inviteList.childNodes;

        await fetch("http://localhost:8080/api/invite/" + this.state.userInvites[idNum].invite_id, {  
            method: "DELETE",                          
            headers: {"Content-Type": "application/json"}
        }).catch(console.log);

        for(count = 0; count < listChildren.length; count++){
            if(listChildren[count].id.localeCompare("inviteListItem-" + idNum) === 0){
                inviteList.removeChild(listChildren[count]); 
                break;
            }
        }

        this.recolorRows(inviteList);
    }

    async acceptInvite(eventObj){
        var idNum = eventObj.event.target.id.split("-")[1];

        var count = 0;

        var inviteList = document.getElementById("inviteList");
        var listChildren = inviteList.childNodes;

        await fetch("http://localhost:8080/api/invite/accept/" + 2 + "/" + this.state.userInvites[idNum].classroom.classroom_id, {  
            method: "POST",                          
            headers: {"Content-Type": "application/json"}
        }).catch(console.log);

        await fetch("http://localhost:8080/api/invite/" + this.state.userInvites[idNum].invite_id, {  
            method: "DELETE",                          
            headers: {"Content-Type": "application/json"}
        }).catch(console.log);

        for(count = 0; count < listChildren.length; count++){
            if(listChildren[count].id.localeCompare("inviteListItem-" + idNum) === 0){
                inviteList.removeChild(listChildren[count]); 
                break;
            }
        }

        this.recolorRows(inviteList);
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
                <Header title="Invites" goBack={true} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="" yesText="Yes" noText="No" id="modalContainerAccept" onYes={this.acceptInvite}/>
                <ConfirmModal text="" yesText="Yes" noText="No" id="modalContainerDecline" onYes={this.declineInvite}/>
                <div className="inviteContainer">
                    <ConfirmToast text=""/>
                    <Popout />
                    <div className="inviteWrapper" id="inviteWrapper">
                        <div className="inviteList" id="inviteList">
                            <div className="inviteFiller"></div>
                            
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default Invite;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
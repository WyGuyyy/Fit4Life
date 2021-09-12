import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './MyGroupInvite.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout';
import ConfirmModal from '../../Confirm/ConfirmModal';
import ConfirmToast from '../../Confirm/ConfirmToast';
import { Link } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';
import {baseURI} from '../../_services/APIService';

class MyGroupInvite extends React.Component{
    constructor(props){
        super(props);

        this.state = {
           canGoBack: props.location.state.goBack,
           groupInvites: "",
           focusedInvite: "",
           focusedInviteItemID: ""
        };

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    async componentDidMount(){ 
        await this.getInvites();
    }

    componentDidUpdate(){
        this.fillInvites();
    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    async getInvites(){

        var invites = [];

        await fetch(baseURI + "/api/groupInvite/forTeacher/" + localStorage.getItem("userID"), {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                invites = result;
            }
        ).catch(console.log);

        this.setState({
            groupInvites: invites
        });

    }

    //START HERE NEXT TIME - DUPLCIATES INVITE ANYTIME ONE IS ACCEPTED OR DECLINED
    //ADDED POSSIBLE FIX BEFORE LEAVING - REMOVED ALL ITEMS FROM LSIT BEOFRE FILLING
    async fillInvites(){

        var list = document.getElementById("myGroupInviteList");
        var count = 0;

        var groupTitle;
        var ownerLastName;

        var invites = this.state.groupInvites;

        while(list.firstChild){
            list.removeChild(list.lastChild);
        }

        for(count = 0; count < invites.length; count++){
            var listItem = document.createElement("div");
            var listItemTitle = document.createElement("h2");
            var listItemOwner = document.createElement("h2");
            var listAcceptButton = document.createElement("button");
            var listDeclineButton = document.createElement("button");
            var iconAccept = document.createElement("i");
            var iconDecline = document.createElement("i");

            var cell1 = document.createElement("div");
            var cell2 = document.createElement("div");
            var cell3 = document.createElement("div");
            var cell4 = document.createElement("div");

            groupTitle = await this.getInviteGroup(invites[count].group.group_id);
            ownerLastName = await this.getInviteOwner(invites[count].owner.user_id);

            iconAccept.classList.add("fa");
            iconAccept.classList.add("fa-check");
            iconAccept.id = "iconAccept-" + count;

            iconDecline.classList.add("fa");
            iconDecline.classList.add("fa-remove");
            iconDecline.id = "iconDecline-" + count;

            listItem.classList.add("Invite-List-Item");
            listItem.id = "myGroupInviteListItem-" + count;
            //listItem.onmouseover = this.changeListItemBackground.bind(this, listItem.id);
            //listItem.onmouseleave = this.returnListItemBackground.bind(this, listItem.id);

            cell1.classList.add("MyGroupInvite-Grid-Cell");
            cell1.classList.add("MyGroupInvite-Grid-Cell-Title");
            cell2.classList.add("MyGroupInvite-Grid-Cell");
            cell2.classList.add("MyGroupInvite-Grid-Cell-Teacher");
            cell3.classList.add("MyGroupInvite-Grid-Cell");
            cell3.classList.add("MyGroupInvite-Grid-Cell-Accept");
            cell4.classList.add("MyGroupInvite-Grid-Cell");
            cell4.classList.add("MyGroupInvite-Grid-Cell-Decline");

            listItemTitle.classList.add("MyGroupInvite-List-Item-Title");
            listItemTitle.textContent = groupTitle;
            listItemTitle.id = "myGroupInviteListItemTitle-" + count;
            listItemTitle.title = "Classroom" + count

            listItemOwner.classList.add("MyGroupInvite-List-Item-Teacher");
            listItemOwner.textContent = "Professor " + ownerLastName;
            listItemOwner.id = "myGroupInviteListItemTeacher-" + count;
            listItemOwner.title = "Professor " + ownerLastName;

            listAcceptButton.classList.add("MyGroupInvite-List-Item-Accept-Button");
            listAcceptButton.id = "myGroupInviteListItemEdit-" + count;
            listAcceptButton.onclick = (e) => this.showAcceptModal({event: e, id: listAcceptButton.id});
            listAcceptButton.appendChild(iconAccept);
            listAcceptButton.title = "Accept Invitation";

            listDeclineButton.classList.add("MyGroupInvite-List-Item-Decline-Button");
            listDeclineButton.id = "myGroupInviteListItemDecline-" + count;
            listDeclineButton.onclick = (e) => this.showDeclineModal({event: e, id: listDeclineButton.id});
            listDeclineButton.appendChild(iconDecline);
            listDeclineButton.title = "Decline Invitation";

            cell1.appendChild(listItemTitle);
            cell2.appendChild(listItemOwner);
            cell3.appendChild(listAcceptButton);
            cell4.appendChild(listDeclineButton);

            listItem.appendChild(cell1);
            listItem.appendChild(cell2);
            listItem.appendChild(cell3);
            listItem.appendChild(cell4);

            listItem.style.background = (count % 2 === 0 ? "#997000" : "#c08d00" );

            list.appendChild(listItem);

        }

    }

    async getInviteGroup(gID){
        var groupTitle;

        await fetch(baseURI + "/api/group/" + gID, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                groupTitle = result.title;
            }
        ).catch(console.log);

        return groupTitle;
    }

    async getInviteOwner(oID){
        var ownerLastName;

        await fetch(baseURI + "/api/user/" + oID, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                ownerLastName = result.last_name;
            }
        ).catch(console.log);

        return ownerLastName;
    }

    changeListItemBackground(id){
        document.getElementById(id).style.background = "#bb911f";
    }

    returnListItemBackground(id){
        var goalList = document.getElementById("myGroupInviteList");
        this.recolorRows(goalList);

        /*var num = id.split("-")[1];
        var backgroundColor = (parseInt(num) % 2 === 0 ? "#c08d00" : "#997000");

        document.getElementById(id).style.background = backgroundColor;*/
    }

    recolorRows(goalList){
        var rowCount = 0;

        for(rowCount = 0; rowCount < goalList.childNodes.length; rowCount++){
            goalList.childNodes[rowCount].style.background = (rowCount % 2 === 0 ? "#c08d00" : "#997000");
        }
    }

    async declineInvite(eventObj){
        //var idNum = eventObj.event.target.id.split("-")[1];

        var count = 0;

        var inviteList = document.getElementById("myGroupInviteList");
        var listChildren = inviteList.childNodes;

        await fetch(baseURI + "/api/invite/" + this.state.focusedInvite.invite_id, {  
            method: "DELETE",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        }).catch(console.log);

        for(count = 0; count < listChildren.length; count++){
            if(listChildren[count].id.localeCompare("myGroupInviteListItem-" + this.state.focusedInviteItemID) === 0){
                inviteList.removeChild(listChildren[count]); 
                break;
            }
        }

        this.recolorRows(inviteList);

        this.confirmBackendTransaction("Invite declined!");

        this.setState({
            focusedInvite: "",
            focusedInviteItemID: ""
        });
    }

    async acceptInvite(eventObj){
        //var idNum = eventObj.event.target.id.split("-")[1];

        var count = 0;

        var inviteList = document.getElementById("myGroupInviteList");
        var listChildren = inviteList.childNodes;

        await fetch(baseURI + "/api/groupInvite/accept/" + localStorage.getItem("userID") + "/" + this.state.focusedInvite.group.group_id, {  
            method: "POST",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        }).catch(console.log);

        await fetch(baseURI + "/api/groupInvite/" + this.state.focusedInvite.invite_id, {  
            method: "DELETE",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        }).catch(console.log);

        for(count = 0; count < listChildren.length; count++){
            if(listChildren[count].id.localeCompare("myGroupInviteListItem-" + this.state.focusedInviteItemID) === 0){
                inviteList.removeChild(listChildren[count]); 
                break;
            }
        }

        this.recolorRows(inviteList);

        this.confirmBackendTransaction("Invite accepted!");

        this.setState({
            focusedInvite: "",
            focusedInviteItemID: ""
        });
    }

    showAcceptModal(eventObj){

        var idNum = eventObj.event.target.id.split("-")[1];
        var anInvite = this.state.groupInvites[idNum];

        this.setState({
            focusedInvite: anInvite,
            focusedInviteItemID: idNum
        });

        document.getElementById("modalContainerAccept").style.display = "flex";
    }

    closeAcceptModal(){
        document.getElementById("modalContainerAccept").style.display = "none";
    }

    showDeclineModal(eventObj){

        var idNum = eventObj.event.target.id.split("-")[1];
        var anInvite = this.state.groupInvites[idNum];

        this.setState({
            focusedInvite: anInvite,
            focusedInviteItemID: idNum
        });

        document.getElementById("modalContainerDecline").style.display = "flex";
    }

    closeDeclineModal(){
        document.getElementById("modalContainerDecline").style.display = "none";
    }

    confirmBackendTransaction(strValue){
        document.getElementById("snackbar").innerHTML = strValue;
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
                <AdminHeader title="Group Invites" breadCrumbs="Group Invites" goBack={false} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Accept invite?" yesText="Yes" noText="No" id="modalContainerAccept" onYes={e => {this.acceptInvite({event: e}); this.closeAcceptModal(); this.confirmBackendTransaction("Invite accepted!");}}/>
                <ConfirmModal text="Decline invite?" yesText="Yes" noText="No" id="modalContainerDecline" onYes={e => {this.declineInvite({event: e}); this.closeDeclineModal(); this.confirmBackendTransaction("Invite declined!");}}/>
                <div className="inviteContainer">
                    <ConfirmToast text=""/>
                    <AdminPopout hist={this.props.location.state.hist}/>
                    <div className="myGroupInviteWrapper" id="myGroupInviteWrapper">
                        <div className="myGroupInviteList" id="myGroupInviteList">
                            <div className="myGroupInviteFiller"></div>
                            
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default MyGroupInvite;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
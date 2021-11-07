import React, { Fragment } from 'react';
import './Group.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout';
import ConfirmModal from '../../Confirm/ConfirmModal';
import ConfirmToast from '../../Confirm/ConfirmToast';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { Link } from 'react-router-dom';
import {baseURI} from '../../_services/APIService';

class Group extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            canGoBack: props.location.state.goBack,
            groupMembers: [],
            selectedGroup: ""
        }

    }
    
    async componentDidMount(){ 
        await this.getMembersAndSetGroup();
    }

    componentDidUpdate(){
        this.renderMembers();
    }

    componentWillUnmount(){
        
    }

    async getMembersAndSetGroup(){
        document.getElementsByClassName("loaderBackground")[0].style.display = "flex";
        
        var groupId = this.props.location.state.group.group_id;
        var members = [];
        var group = "";

        var that = this;

        await fetch(baseURI + "/api/group/getMembers/" + groupId, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                members = result;
            }
        ).catch(console.log);

        await fetch(baseURI + "/api/group/" + groupId, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                group = result;
            }
        ).catch(console.log);

        this.setState({
            groupMembers: members,
            selectedGroup: group
        });

        document.getElementsByClassName("loaderBackground")[0].style.display = "none";
    }

    renderMembers(){

        document.getElementsByClassName("loaderBackground")[0].style.display = "flex";

        var members = this.state.groupMembers;
        var list = document.getElementById("memberList-Admin");
        var isOwner = this.props.location.state.isOwner;

        while (list.firstChild) {
            list.removeChild(list.lastChild);
        }

        for(var count = 0; count < members.length; count++){

            /*if(members[count].user_id === parseInt(localStorage.getItem("userID"))){
                continue;
            }*/

            var listItem = document.createElement("div");
            var listItemTitleName = document.createElement("h2");
            var listItemTitleEmail = document.createElement("h2");
            
            var listDeleteButton = document.createElement("button");
            var iconDelete = document.createElement("i");

            var cell1 = document.createElement("div");
            var cell2 = document.createElement("div");
            var cell3 = document.createElement("div");

            iconDelete.classList.add("fa");
            iconDelete.classList.add("fa-trash");
            iconDelete.id = "iconDelete-" + count;

            listItem.classList.add("Member-List-Item-Admin");
            listItem.id = "memberListItem-" + count + "-Admin";

            cell1.classList.add("Member-Grid-Cell-Admin");
            cell1.classList.add("Member-Grid-Cell-Name-Admin");
            cell2.classList.add("Member-Grid-Cell-Admin");
            cell2.classList.add("Member-Grid-Cell-Email-Admin");
            cell3.classList.add("Member-Grid-Cell-Admin");
            cell3.classList.add("Member-Grid-Cell-Delete-Admin");

            listItemTitleName.classList.add("Member-List-Item-Name-Admin");
            listItemTitleName.textContent = members[count].first_name + " " + members[count].last_name;
            listItemTitleName.id = "memberListItemName-" + count + "-Admin";
            listItemTitleName.title = members[count].first_name + " " + members[count].last_name;
            listItemTitleName.onclick = (e) => this.goToMember({event: e, id: listItem.id});

            listItemTitleEmail.classList.add("Member-List-Item-Email-Admin");
            listItemTitleEmail.textContent = members[count].email;
            listItemTitleEmail.id = "memberListItemEmail-" + count + "-Admin";
            listItemTitleEmail.title = members[count].email;
            listItemTitleEmail.onclick = (e) => this.goToMember({event: e, id: listItem.id});

            listDeleteButton.classList.add("Member-List-Item-Delete-Button-Admin");
            listDeleteButton.id = "memberListItemDelete-" + count + "-Admin";
            listDeleteButton.onclick = (e) => this.showModal({event: e, id: listDeleteButton.id});
            listDeleteButton.appendChild(iconDelete);
            listDeleteButton.title = "Delete " + listItemTitleName.textContent;

            cell1.appendChild(listItemTitleName);
            cell2.appendChild(listItemTitleEmail);

            listItem.appendChild(cell1);
            listItem.appendChild(cell2);

            if(isOwner && members[count].user_id !== parseInt(localStorage.getItem("userID"))){
                cell3.appendChild(listDeleteButton);
                listItem.appendChild(cell3);
            }

            listItem.style.background = (list.children.length % 2 === 0 ? "#997000" : "#c08d00" );

            list.appendChild(listItem);

        }

        document.getElementsByClassName("loaderBackground")[0].style.display = "none";

    }

    async searchMembers(){

        document.getElementsByClassName("loaderBackground")[0].style.display = "flex";

        var list = document.getElementById("memberList-Admin");
        var count = 0;
        var searchText = document.getElementsByClassName("Fit4Life-Searchbar-Admin")[0].value.trim();
        var groupId = this.props.group.group_id;

        var members = [];

        while (list.firstChild) {
            list.removeChild(list.lastChild);
        }

        await fetch(baseURI + "/api/group/getMembers/" + groupId, {  
                method: "GET",                          
                headers: {"Content-Type": "application/json",
                          "Authorization": "Bearer " + localStorage.getItem("auth_token")}
            })
            .then(res => res.text())
            .then(
                (text) => {
                    var result = text.length ? JSON.parse(text) : {};
                    members = result;
                }
            ).catch(console.log);

            for(var count = 0; count < members.length; count++){
                if(!members[count].title.toLowerCase().includes(searchText.toLowerCase())){
                    members.splice(count, 1);
                    count = count - 1;
                }
            }

        this.setState({
            groupMembers: members
        });

        document.getElementsByClassName("loaderBackground")[0].style.display = "none";

    }

    openGroupNameModel(event){

        var listCount = document.getElementById("memberList-Admin").children.length;

        var groupNameCover = document.getElementsByClassName("Member-CreateName-Modal-Cover")[0];
        document.getElementsByClassName("Member-CreateName-Input")[0].value = this.state.selectedGroup.title;

        groupNameCover.style.display = "flex";
    }

    closeGroupNameModel(event){

        var groupNameCover = document.getElementsByClassName("Member-CreateName-Modal-Cover")[0];
        document.getElementsByClassName("Member-CreateName-Input")[0].value = "";

        groupNameCover.style.display = "none";

    }

    async updateGroup(eventObj){

        var ownerID = localStorage.getItem("userID");
        var updatedGroup = this.state.selectedGroup;
        var newTitle = document.getElementsByClassName("Member-CreateName-Input")[0].value;

        updatedGroup.title = newTitle;
        var groupId = updatedGroup.group_id;

        var newGroup = {
            group_id: groupId,
            group_owner: {user_id: ownerID},
            title: newTitle
        };

        await fetch(baseURI + "/api/group", {  
            method: "PUT",                          
            headers: {"Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("auth_token")},
            body: JSON.stringify(newGroup) 
        }).catch(console.log);

        this.closeGroupNameModel(null);

        this.setState({
            selectedGroup: updatedGroup
        });
    }

    goToMember(eventObj){

            var idNum = eventObj.event.target.id.split("-")[1];
            var aMember = this.state.groupMembers[idNum];

            this.props.history.push({
                pathname: "/groupMember",
                state: {goalID: eventObj.id, goBack: true, member: aMember, flag: "M"}
            });
    }

    goToAllMemberData(event){
        var members = this.state.groupMembers;

        this.props.history.push({
            pathname: "/groupMember",
            state: {goBack: true, members: members, flag: "A"}
        });
    }

    goToGroupInvite(event){

        var aGroup = this.state.selectedGroup;

        this.props.history.push({
            pathname: "/groupInvite",
            state: {goBack: true, group: aGroup}
        });
    }

    async removeMember(event){

        //var count = 0;
        var newMembers = this.state.groupMembers;
        //var memberList = document.getElementById("memberList-Admin");
        var idNum = parseInt(this.state.focusedMemberItemID);

        var teacherID = newMembers[idNum].user_id;
        var groupID = this.state.selectedGroup.group_id;
        //var listChildren = goalList.childNodes;

        await fetch(baseURI + "/api/group/remove/" + teacherID + "/" + groupID, {  
            method: "DELETE",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        }).catch(console.log);

        await fetch(baseURI + "/api/group/getMembers/" + groupID, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                newMembers = result;
            }
        ).catch(console.log);

        this.setState({
            groupMembers: newMembers
        });

    }

    showModal(eventObj){

        var idNum = eventObj.event.target.id.split("-")[1];
        var aMember = this.state.groupMembers[idNum];

        this.setState({
            focusedMember: aMember,
            focusedMemberItemID: idNum
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
        
        var title = this.state.selectedGroup === undefined ? "Group" : this.state.selectedGroup.title;

        return(

            <Fragment>
                <AdminHeader title={title} breadCrumbs={title} goBack={true} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Remove member?" yesText="Yes" noText="No" onYes={e => {this.removeMember(e); this.closeModal(); this.confirmBackendTransaction();}}/>
                <LoadingSpinner/>
                <div className="Member-CreateName-Modal-Cover">
                    <div className="Member-CreateName-Modal">
                        <label className="Member-CreateName-Label">Group Name:</label>
                        <input className="Member-CreateName-Input"/>
                        <div className="Member-CreateName-ButtonWrapper">
                            <button className="Member-CreateName-CreateButton" onClick={e => this.updateGroup(e)}>Update</button>
                            <button className="Member-CreateName-CancelButton" onClick={e => this.closeGroupNameModel(e)}>Cancel</button>
                        </div>
                    </div>
                </div>
                <div className="homeContainer">
                    <AdminPopout hist={this.props.history}/>
                    <div className="memberWrapper-Admin" id="memberWrapper-Admin">
                        <ConfirmToast text="Member removed!"/>
                        <div className="memberList-Admin" id="memberList-Admin">
                            
                        </div>
                    </div>
                    <div className="Fit4Life-SearchbarWrapper-Admin">
                        <button className="Member-MemberData-Button" onClick={e => this.goToAllMemberData(e)}>All</button>
                        <input className="Fit4Life-Searchbar-Admin"/>
                        <button className="Fit4Life-SearchButton-Admin" onClick={e => this.searchGroups(e)}>Search</button>
                        {this.props.location.state.isOwner ?
                        <div>
                            <button className="Member-AddTeacher-Button" onClick={e => this.goToGroupInvite(e)}><i className="fa fa-group" style={{fontSize: "20px"}}/></button>
                            <button className="Member-EditGroup-Button" onClick={e => this.openGroupNameModel(e)}><i className="fa fa-pencil" style={{fontSize: "20px"}}/></button>
                        </div>
                        :
                        ""
                    }
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default Group;


//"react-router-dom": "^6.0.0-alpha.1",
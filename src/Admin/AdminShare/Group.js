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
            canGoBack: props.goBack,
            groupMembers: [],
            selectedGroup: props.group
        }

    }
    
    async componentDidMount(){ 
        await this.getMembers();
    }

    componentDidUpdate(){
        this.renderMembers();
    }

    componentWillUnmount(){
        
    }

    async getMembers(){
        var groupId = this.props.group.group_id;
        var members = [];

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

        this.setState({
            groupMembers: members
        });
    }

    renderMembers(){
        var members = this.state.groupMembers;
        var list = document.getElementById("memberList-Admin");

        while (list.firstChild) {
            list.removeChild(list.lastChild);
        }

        for(var count = 0; count < groups.length; count++){

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

            listItemTitleName.classList.add("Group-List-Item-Name-Admin");
            listItemTitleName.textContent = groups[count].title;
            listItemTitleName.id = "groupListItemName-" + count + "-Admin";
            listItemTitleName.title = groups[count].title;
            listItemTitleName.onclick = (e) => this.goToGroup({event: e, id: listItem.id});

            listItemTitleEmail.classList.add("Group-List-Item-Email-Admin");
            listItemTitleEmail.textContent = groups[count].title;
            listItemTitleEmail.id = "groupListItemEmail-" + count + "-Admin";
            listItemTitleEmail.title = groups[count].title;
            listItemTitleEmail.onclick = (e) => this.goToGroup({event: e, id: listItem.id});

            listDeleteButton.classList.add("Group-List-Item-Delete-Button-Admin");
            listDeleteButton.id = "groupListItemDelete-" + count + "-Admin";
            listDeleteButton.onclick = (e) => this.showModal({event: e, id: listDeleteButton.id});
            listDeleteButton.appendChild(iconDelete);
            listDeleteButton.title = "Delete " + listItemTitle.textContent;

            cell1.appendChild(listItemTitleName);
            cell2.appendChild(listItemTitleEmail);
            cell3.appendChild(listDeleteButton);

            listItem.appendChild(cell1);
            listItem.appendChild(cell2);
            listItem.appendChild(cell3);

            listItem.style.background = (count % 2 === 0 ? "#997000" : "#c08d00" );

            list.appendChild(listItem);

        }
    }

    async searchGroups(){

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
                if(!groups[count].title.toLowerCase().includes(searchText.toLowerCase())){
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
        var updatedGroup = this.state.group;
        var newTitle = document.getElementsByClassName("Group-CreateName-Input")[0].value;

        updatedGroup.title = newTitle;
        groupId = updatedGroup.group_id;

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
            group: updatedGroup
        });
    }

    goToMember(eventObj){

            var idNum = eventObj.event.target.id.split("-")[1];
            var aMember = this.state.groupMembers[idNum];

            this.props.history.push({
                pathname: "/member",
                state: {goalID: eventObj.id, goBack: true, member: aMember}
            });
    }

    async removeMember(event){

        var count = 0;
        var newGroups = this.state.ownerGroups;
        var goalList = document.getElementById("memberList-Admin");
        var idNum = parseInt(this.state.focusedGroupItemID);

        var groupID = newGroups[idNum].group_id;
        var ownerID = localStorage.getItem("userID");
        //var listChildren = goalList.childNodes;

        await fetch(baseURI + "/api/group/" + groupID, {  
            method: "DELETE",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        }).catch(console.log);

        await fetch(baseURI + "/api/group/forOwner/" + ownerID, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                newGroups = result;
            }
        ).catch(console.log);

        this.setState({
            ownerGroups: newGroups
        });

    }

    showModal(eventObj){

        var idNum = eventObj.event.target.id.split("-")[1];
        var aGroup = this.state.ownerGroups[idNum];

        this.setState({
            focusedGroup: aGroup,
            focusedGroupItemID: idNum
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
                <AdminHeader title="Share Home" breadCrumbs="Share Home" goBack={false} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Delete group?" yesText="Yes" noText="No" onYes={e => {this.deleteGroup(e); this.closeModal(); this.confirmBackendTransaction();}}/>
                <LoadingSpinner/>
                <div className="Group-CreateName-Modal-Cover">
                    <div className="Group-CreateName-Modal">
                        <label className="Group-CreateName-Label">Group Name:</label>
                        <input className="Group-CreateName-Input"/>
                        <div className="Group-CreateName-ButtonWrapper">
                            <button className="Group-CreateName-CreateButton" onClick={e => this.createGroup(e)}>Create</button>
                            <button className="Group-CreateName-CancelButton" onClick={e => this.closeGroupNameModel(e)}>Cancel</button>
                        </div>
                    </div>
                </div>
                <div className="homeContainer">
                    <AdminPopout hist={this.props.history}/>
                    <button className="Group-Create-Button-Admin" title="Create Group" onClick={(e)=>this.openGroupNameModel({event: e})}>+</button>
                    <div className="groupWrapper-Admin" id="groupWrapper-Admin">
                        <ConfirmToast text="Group deleted!"/>
                        <div className="groupList-Admin" id="groupList-Admin">
                            
                        </div>
                    </div>
                    <div className="Fit4Life-SearchbarWrapper-Admin">
                        <input className="Fit4Life-Searchbar-Admin"/>
                        <button className="Fit4Life-SearchButton-Admin" onClick={e => this.searchGroups(e)}>Search</button>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default Group;


//"react-router-dom": "^6.0.0-alpha.1",
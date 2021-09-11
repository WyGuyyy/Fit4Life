import React, { Fragment } from 'react';
import './ShareHome.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout';
import ConfirmModal from '../../Confirm/ConfirmModal';
import ConfirmToast from '../../Confirm/ConfirmToast';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { Link } from 'react-router-dom';
import {baseURI} from '../../_services/APIService';

class ShareHome extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            canGoBack: false,
            ownerGroups: []
        }

    }
    
    async componentDidMount(){ 
        await this.getGroups();
    }

    componentDidUpdate(){
        this.renderGroups();
    }

    componentWillUnmount(){
        
    }

    async getGroups(){
        var ownerID = localStorage.getItem("userID");
        var groups = [];

        await fetch(baseURI + "/api/group/forOwner/" + ownerID, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                groups = result;
            }
        ).catch(console.log);

        this.setState({
            ownerGroups: groups
        });
    }

    renderGroups(){
        var groups = this.state.ownerGroups;
        var list = document.getElementById("groupList-Admin");

        while (list.firstChild) {
            list.removeChild(list.lastChild);
        }

        for(var count = 0; count < groups.length; count++){

            var listItem = document.createElement("div");
            var listItemTitle = document.createElement("h2");
            var listDeleteButton = document.createElement("button");
            var iconDelete = document.createElement("i");

            var cell1 = document.createElement("div");
            var cell2 = document.createElement("div");

            iconDelete.classList.add("fa");
            iconDelete.classList.add("fa-trash");
            iconDelete.id = "iconDelete-" + count;

            listItem.classList.add("Group-List-Item-Admin");
            listItem.id = "groupListItem-" + count + "-Admin";

            cell1.classList.add("Group-Grid-Cell-Admin");
            cell1.classList.add("Group-Grid-Cell-Title-Admin");
            cell2.classList.add("Group-Grid-Cell-Admin");
            cell2.classList.add("Group-Grid-Cell-Delete-Admin");

            listItemTitle.classList.add("Group-List-Item-Title-Admin");
            listItemTitle.textContent = groups[count].title;
            listItemTitle.id = "groupListItemTitle-" + count + "-Admin";
            listItemTitle.title = groups[count].title;
            listItemTitle.onclick = (e) => this.goToGroup({event: e, id: listItem.id});

            listDeleteButton.classList.add("Group-List-Item-Delete-Button-Admin");
            listDeleteButton.id = "groupListItemDelete-" + count + "-Admin";
            listDeleteButton.onclick = (e) => this.showModal({event: e, id: listDeleteButton.id});
            listDeleteButton.appendChild(iconDelete);
            listDeleteButton.title = "Delete " + listItemTitle.textContent;

            cell1.appendChild(listItemTitle);
            cell2.appendChild(listDeleteButton);

            listItem.appendChild(cell1);
            listItem.appendChild(cell2);

            listItem.style.background = (count % 2 === 0 ? "#997000" : "#c08d00" );

            list.appendChild(listItem);

        }
    }

    async searchGroups(){

        document.getElementsByClassName("loaderBackground")[0].style.display = "flex";

        var list = document.getElementById("groupList-Admin");
        var count = 0;
        var searchText = document.getElementsByClassName("Fit4Life-Searchbar-Admin")[0].value.trim();
        var ownerID = localStorage.getItem("userID");

        var groups = [];

        while (list.firstChild) {
            list.removeChild(list.lastChild);
        }

        await fetch(baseURI + "/api/group/forOwner/" + ownerID, {  
                method: "GET",                          
                headers: {"Content-Type": "application/json",
                          "Authorization": "Bearer " + localStorage.getItem("auth_token")}
            })
            .then(res => res.text())
            .then(
                (text) => {
                    var result = text.length ? JSON.parse(text) : {};
                    groups = result;
                }
            ).catch(console.log);

            for(var count = 0; count < groups.length; count++){
                if(!groups[count].title.toLowerCase().includes(searchText.toLowerCase())){
                    groups.splice(count, 1);
                    count = count - 1;
                }
            }

        this.setState({
            ownerGroups: groups
        });

        document.getElementsByClassName("loaderBackground")[0].style.display = "none";

    }

    openGroupNameModel(event){

        var listCount = document.getElementById("groupList-Admin").children.length;

        var groupNameCover = document.getElementsByClassName("Group-CreateName-Modal-Cover")[0];
        document.getElementsByClassName("Group-CreateName-Input")[0].value = "Group " + listCount;

        groupNameCover.style.display = "flex";
    }

    closeGroupNameModel(event){

        var groupNameCover = document.getElementsByClassName("Group-CreateName-Modal-Cover")[0];
        document.getElementsByClassName("Group-CreateName-Input")[0].value = "";

        groupNameCover.style.display = "none";

    }

    async createGroup(eventObj){

        var ownerID = localStorage.getItem("userID");
        var groups = [];

        var newGroup = {
            group_owner: {user_id: ownerID},
            title: document.getElementsByClassName("Group-CreateName-Input")[0].value
        };

        await fetch(baseURI + "/api/group", {  
            method: "POST",                          
            headers: {"Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("auth_token")},
            body: JSON.stringify(newGroup) 
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
                groups = result;
            }
        ).catch(console.log);

        this.closeGroupNameModel(null);

        this.setState({
            ownerGroups: groups
        });
    }

    goToGroup(eventObj){

            var idNum = eventObj.event.target.id.split("-")[1];
            var aGroup = this.state.ownerGroups[idNum];

            this.props.history.push({
                pathname: "/group",
                state: {goalID: eventObj.id, goBack: true, group: aGroup}
            });
    }

    async deleteGroup(event){

        var count = 0;
        var newGroups = this.state.ownerGroups;
        var goalList = document.getElementById("groupList-Admin");
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

export default ShareHome;


//"react-router-dom": "^6.0.0-alpha.1",
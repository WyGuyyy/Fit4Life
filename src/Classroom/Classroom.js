import React, { Fragment } from 'react';
import './Classroom.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout'
import AdminHeader from '../Admin/AdminHeader/AdminHeader';
import { Link } from 'react-router-dom';
import {RedirectService} from '../_services/RedirectService';
import AdminPopout from '../Admin/AdminPopout/AdminPopout';
import {baseURI} from '../_services/APIService';
import {authService} from '../_services/AuthenticationService';

class Classroom extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                canGoBack: true,
                classroom: props.location.state.selectedClassroom,
                classroomComponents: ""
            }
        }

    }
    
    componentDidMount(){ 
        if(RedirectService.checkItemForUndefined(this.props.location.state)){
            this.fillComponents()
        }

        authService.checkTokenValidity(this.props.history);
    }

    componentWillUnmount(){
        
    }

    async fillComponents(){
        var components = [];
        var count = 0;
        var classroomWrapper = document.getElementById("classroomWrapper");
        var classroomID = this.state.classroom.classroom_id;

        //await fetch(baseURI + "/api/classroom", {
            await fetch(baseURI + "/api/component/byclass/" + classroomID, {  
                method: "GET",                          
                headers: {"Content-Type": "application/json",
                          "Authorization": "Bearer " + localStorage.getItem("auth_token")}
            })
            .then(res => res.text())
            .then(
                (text) => {
                    var result = text.length ? JSON.parse(text) : {};
                    components = result;
                }
            ).catch(console.log);

            for(count = 0; count < components.length; count++){
                var componentButton = document.createElement("button");
                var title = components[count].title;

                componentButton.classList.add("homeButton");
                componentButton.id = "Home-Button-" + count;
                componentButton.onclick = e => this.goToComponent(e);
                componentButton.textContent = title;

                classroomWrapper.appendChild(componentButton);

            }

            this.setState({
                classroomComponents: components
            });

    }

    goToComponent(event){

        //var btn = document.getElementById(event.target.id);
        var idNum = event.target.id.split("-")[2];
        var aComponent = this.state.classroomComponents[idNum];
        var aClassroom = this.state.classroom;

        this.props.history.push({
            pathname: "/component",
            state: {selectedClassroom: aClassroom, selectedComponent: aComponent}
        });
    }

    goBack(){ //This isnt working, start here next time
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }
    
    render(){
        if(!RedirectService.checkItemForUndefined(this.props.location.state)){
            return RedirectService.decideRedirect();
        }

        var classroom = this.props.location.state.selectedClassroom.title;

        return(

            <Fragment>
                {localStorage.getItem("userRole").localeCompare("STUDENT") === 0 ? 
                <Header title={"Components"} breadCrumbs={"Components for " + classroom} goBack={false} customClick={this.goBack.bind(this)}/> :
                <AdminHeader title="Preview" breadCrumbs={"Preview for class " + classroom} goBack={true} customClick={this.goBack.bind(this)}/>}
                <div className="classroomContainer">
                    
                    <div className="classroomWrapper" id="classroomWrapper">
                        <div className="Classroom-Button-Wrapper">
                            <div className="classroomFiller"></div>
                            
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default Classroom;


//"react-router-dom": "^6.0.0-alpha.1",
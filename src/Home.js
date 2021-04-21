import React, { Fragment } from 'react';
import './Home.css';
import Header from './Header/Header';
import Popout from './Popout/Popout'
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import { Link } from 'react-router-dom';
import {baseURI} from './_services/APIService';

class Home extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            canGoBack: false,
            studentClassrooms: ""
        }

    }
    
    componentDidMount(){ 
        this.fillClassrooms();
    }

    componentWillUnmount(){
        
    }

    async fillClassrooms(){
        
        document.getElementsByClassName("loaderBackground")[0].style.display = "flex";

        var classrooms = [];
        var count = 0;
        var classroomWrapper = document.getElementById("homeWrapper");

        //await fetch(baseURI + "/api/classroom", {
            await fetch(baseURI + "/api/classroom/foruser/" + localStorage.getItem("userID"), {  
                method: "GET",                          
                headers: {"Content-Type": "application/json",
                          "Authorization": "Bearer " + localStorage.getItem("auth_token")}
            })
            .then(res => res.text())
            .then(
                (text) => {
                    var result = text.length ? JSON.parse(text) : {};
                    classrooms = result;
                }
            ).catch(console.log);

            for(count = 0; count < classrooms.length; count++){
                var classButton = document.createElement("button");
                var title = classrooms[count].title;

                classButton.classList.add("homeButton");
                classButton.id = "Home-Button-" + count;
                classButton.onclick = e => this.goToComponent(e);
                classButton.textContent = title;

                classroomWrapper.appendChild(classButton);
            }

            this.setState({
                studentClassrooms: classrooms
            });

            document.getElementsByClassName("loaderBackground")[0].style.display = "none";
    }

    async searchClassrooms(event){

        document.getElementsByClassName("loaderBackground")[0].style.display = "flex";

        var classrooms = [];
        var count = 0;
        var classroomWrapper = document.getElementById("homeWrapper");
        var searchText = document.getElementsByClassName("Fit4Life-Searchbar")[0].value.trim();

        //await fetch(baseURI + "/api/classroom", {
            await fetch(baseURI + "/api/classroom/foruser/" + localStorage.getItem("userID"), {  
                method: "GET",                          
                headers: {"Content-Type": "application/json",
                          "Authorization": "Bearer " + localStorage.getItem("auth_token")}
            })
            .then(res => res.text())
            .then(
                (text) => {
                    var result = text.length ? JSON.parse(text) : {};
                    classrooms = result;
                }
            ).catch(console.log);
    
            for(var count = 0; count < classrooms.length; count++){
                if(!classrooms[count].title.toLowerCase().includes(searchText.toLowerCase())){
                    classrooms.splice(count, 1);
                    count = count - 1;
                }
            }

            classroomWrapper.innerHTML = '';

            for(count = 0; count < classrooms.length; count++){
                var classButton = document.createElement("button");
                var title = classrooms[count].title;

                classButton.classList.add("homeButton");
                classButton.id = "Home-Button-" + count;
                classButton.onclick = e => this.goToComponent(e);
                classButton.textContent = title;

                classroomWrapper.appendChild(classButton);
            }

        this.setState({
            studentClassrooms: classrooms
        });

        document.getElementsByClassName("loaderBackground")[0].style.display = "none";
    }

    goToComponent(event){

        //var btn = document.getElementById(event.target.id);
        var idNum = event.target.id.split("-")[2];
        var aClassroom = this.state.studentClassrooms[idNum];

        this.props.history.push({
            pathname: "/classroom",
            state: {selectedClassroom: aClassroom}
        });
    }

    goBack(){ //This isnt working, start here next time
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }
    
    render(){

        return(

            <Fragment>
                <Header title="Home" breadCrumbs="Home" goBack={false} customClick={this.goBack.bind(this)}/>
                <LoadingSpinner />
                <div className="homeContainer">
                    <Popout hist={this.props.history}/>
                    <div className="homeWrapper" id="homeWrapper">
                        <div className="Home-Button-Wrapper">

                        </div>
                    </div>
                    <div className="Fit4Life-SearchbarWrapper">
                        <input className="Fit4Life-Searchbar"/>
                        <button className="Fit4Life-SearchButton" onClick={e => this.searchClassrooms(e)}>Search</button>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default Home;


//"react-router-dom": "^6.0.0-alpha.1",
import React, { Fragment } from 'react';
import './Home.css';
import Header from './Header/Header';
import Popout from './Popout/Popout'
import { Link } from 'react-router-dom';

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

        var classrooms;
        var count = 0;
        var classroomWrapper = document.getElementById("homeWrapper");

        //await fetch("http://192.168.1.5:8080/api/classroom", {
            await fetch("http://localhost:8080/api/classroom", {  
                method: "GET",                          
                headers: {"Content-Type": "application/json"}
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
        console.log(this.props);
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }
    
    render(){

        return(

            <Fragment>
                <Header title="Home" goBack={false} customClick={this.goBack.bind(this)}/>
                <div className="homeContainer">
                    <Popout />
                    <div className="homeWrapper" id="homeWrapper">
                        <div className="Home-Button-Wrapper">
                            <div className="homeFiller"></div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default Home;


//"react-router-dom": "^6.0.0-alpha.1",
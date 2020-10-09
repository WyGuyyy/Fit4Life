import React, { Fragment } from 'react';
import './Classroom.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout'
import { Link } from 'react-router-dom';

class Classroom extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            canGoBack: true,
            classroomName: props.location.state.classroom
        }

    }
    
    componentDidMount(){ 
        this.fillComponents()
    }

    componentWillUnmount(){
        
    }

    async fillComponents(){
        var components;
        var count = 0;
        var classroomWrapper = document.getElementById("classroomWrapper");

        //await fetch("http://192.168.1.5:8080/api/classroom", {
            await fetch("http://localhost:8080/api/component", {  
                method: "GET",                          
                headers: {"Content-Type": "application/json"}
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
    }

    goToComponent(event){

        var btn = document.getElementById(event.target.id);

        this.props.history.push({
            pathname: "/component",
            state: {component: btn.innerHTML}
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
                <Header title={this.props.location.state.classroom} goBack={false} customClick={this.goBack.bind(this)}/>
                <div className="classroomContainer">
                    <Popout />
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
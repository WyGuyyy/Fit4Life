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
    
    }

    componentWillUnmount(){
        
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
                            <button className="classroomButton" id="Classroom-Button-1" onClick={e => this.goToComponent(e)}>Cardio</button>
                            <button className="classroomButton" id="Classroom-Button-2" onClick={e => this.goToComponent(e)}>Muscular Strength</button>
                            <button className="classroomButton" id="Classroom-Button-3" onClick={e => this.goToComponent(e)}>Muscular Endurance</button>
                            <button className="classroomButton" id="Classroom-Button-4" onClick={e => this.goToComponent(e)}>Flexibility</button>
                            <button className="classroomButton" id="Classroom-Button-1" onClick={e => this.goToComponent(e)}>Cardio</button>
                            <button className="classroomButton" id="Classroom-Button-2" onClick={e => this.goToComponent(e)}>Muscular Strength</button>
                            <button className="classroomButton" id="Classroom-Button-3" onClick={e => this.goToComponent(e)}>Muscular Endurance</button>
                            <button className="classroomButton" id="Classroom-Button-4" onClick={e => this.goToComponent(e)}>Flexibility</button>
                            <button className="classroomButton" id="Classroom-Button-1" onClick={e => this.goToComponent(e)}>Cardio</button>
                            <button className="classroomButton" id="Classroom-Button-2" onClick={e => this.goToComponent(e)}>Muscular Strength</button>
                            <button className="classroomButton" id="Classroom-Button-3" onClick={e => this.goToComponent(e)}>Muscular Endurance</button>
                            <button className="classroomButton" id="Classroom-Button-4" onClick={e => this.goToComponent(e)}>Flexibility</button>
                            <button className="classroomButton" id="Classroom-Button-1" onClick={e => this.goToComponent(e)}>Cardio</button>
                            <button className="classroomButton" id="Classroom-Button-2" onClick={e => this.goToComponent(e)}>Muscular Strength</button>
                            <button className="classroomButton" id="Classroom-Button-3" onClick={e => this.goToComponent(e)}>Muscular Endurance</button>
                            <button className="classroomButton" id="Classroom-Button-4" onClick={e => this.goToComponent(e)}>Flexibility</button>
                            <button className="classroomButton" id="Classroom-Button-1" onClick={e => this.goToComponent(e)}>Cardio</button>
                            <button className="classroomButton" id="Classroom-Button-2" onClick={e => this.goToComponent(e)}>Muscular Strength</button>
                            <button className="classroomButton" id="Classroom-Button-3" onClick={e => this.goToComponent(e)}>Muscular Endurance</button>
                            <button className="classroomButton" id="Classroom-Button-4" onClick={e => this.goToComponent(e)}>Flexibility</button>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default Classroom;


//"react-router-dom": "^6.0.0-alpha.1",
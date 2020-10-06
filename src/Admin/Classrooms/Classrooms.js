import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './Classrooms.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import { Link } from 'react-router-dom';

class Classrooms extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            
        };

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
        
    }

    componentDidUpdate(){

    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    //Render the Header component to the DOM/Screen
    render(){

        return(

            <Fragment>
                <Header title="Home" goBack={false}/>
                <div className="homeContainer">
                    <Popout />
                    <div className="homeWrapper" id="homeWrapper">
                        <div className="Home-Button-Wrapper">
                            <div className="homeFiller"></div>
                            <button className="homeButton" id="Home-Button-1" onClick={e => this.goToComponent(e)}>Cardio</button>
                            <button className="homeButton" id="Home-Button-2" onClick={e => this.goToComponent(e)}>Muscular Strength</button>
                            <button className="homeButton" id="Home-Button-3" onClick={e => this.goToComponent(e)}>Muscular Endurance</button>
                            <button className="homeButton" id="Home-Button-4" onClick={e => this.goToComponent(e)}>Flexibility</button>
                            <button className="homeButton" id="Home-Button-1" onClick={e => this.goToComponent(e)}>Cardio</button>
                            <button className="homeButton" id="Home-Button-2" onClick={e => this.goToComponent(e)}>Muscular Strength</button>
                            <button className="homeButton" id="Home-Button-3" onClick={e => this.goToComponent(e)}>Muscular Endurance</button>
                            <button className="homeButton" id="Home-Button-4" onClick={e => this.goToComponent(e)}>Flexibility</button>
                            <button className="homeButton" id="Home-Button-1" onClick={e => this.goToComponent(e)}>Cardio</button>
                            <button className="homeButton" id="Home-Button-2" onClick={e => this.goToComponent(e)}>Muscular Strength</button>
                            <button className="homeButton" id="Home-Button-3" onClick={e => this.goToComponent(e)}>Muscular Endurance</button>
                            <button className="homeButton" id="Home-Button-4" onClick={e => this.goToComponent(e)}>Flexibility</button>
                            <button className="homeButton" id="Home-Button-1" onClick={e => this.goToComponent(e)}>Cardio</button>
                            <button className="homeButton" id="Home-Button-2" onClick={e => this.goToComponent(e)}>Muscular Strength</button>
                            <button className="homeButton" id="Home-Button-3" onClick={e => this.goToComponent(e)}>Muscular Endurance</button>
                            <button className="homeButton" id="Home-Button-4" onClick={e => this.goToComponent(e)}>Flexibility</button>
                            <button className="homeButton" id="Home-Button-1" onClick={e => this.goToComponent(e)}>Cardio</button>
                            <button className="homeButton" id="Home-Button-2" onClick={e => this.goToComponent(e)}>Muscular Strength</button>
                            <button className="homeButton" id="Home-Button-3" onClick={e => this.goToComponent(e)}>Muscular Endurance</button>
                            <button className="homeButton" id="Home-Button-4" onClick={e => this.goToComponent(e)}>Flexibility</button>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default Classrooms;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
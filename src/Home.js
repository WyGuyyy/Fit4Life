import React, { Fragment } from 'react';
import './Home.css';
import Header from './Header/Header';
import Popout from './Popout/Popout'
import { Link } from 'react-router-dom';

class Home extends React.Component{
    constructor(props){
        super(props);


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

    
    render(){

        return(

            <Fragment>
                <Header title="Home" />
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

export default Home;


//"react-router-dom": "^6.0.0-alpha.1",
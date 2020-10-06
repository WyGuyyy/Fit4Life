import React, { Fragment } from 'react';
import './Home.css';
import Header from './Header/Header';
import Popout from './Popout/Popout'
import { Link } from 'react-router-dom';

class Home extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            canGoBack: false
        }

    }
    
    componentDidMount(){ 
    
    }

    componentWillUnmount(){
        
    }

    goToComponent(event){

        var btn = document.getElementById(event.target.id);

        this.props.history.push({
            pathname: "/classroom",
            state: {classroom: btn.innerHTML}
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
                            <button className="homeButton" id="Home-Button-1" onClick={e => this.goToComponent(e)}>PE 101</button>
                            <button className="homeButton" id="Home-Button-2" onClick={e => this.goToComponent(e)}>PE 112</button>
                            <button className="homeButton" id="Home-Button-3" onClick={e => this.goToComponent(e)}>PE 211</button>
                            <button className="homeButton" id="Home-Button-4" onClick={e => this.goToComponent(e)}>Senior Strength 415</button>
                            <button className="homeButton" id="Home-Button-1" onClick={e => this.goToComponent(e)}>PE 101</button>
                            <button className="homeButton" id="Home-Button-2" onClick={e => this.goToComponent(e)}>PE 112</button>
                            <button className="homeButton" id="Home-Button-3" onClick={e => this.goToComponent(e)}>PE 211</button>
                            <button className="homeButton" id="Home-Button-4" onClick={e => this.goToComponent(e)}>Senior Strength 415</button>
                            <button className="homeButton" id="Home-Button-1" onClick={e => this.goToComponent(e)}>PE 101</button>
                            <button className="homeButton" id="Home-Button-2" onClick={e => this.goToComponent(e)}>PE 112</button>
                            <button className="homeButton" id="Home-Button-3" onClick={e => this.goToComponent(e)}>PE 211</button>
                            <button className="homeButton" id="Home-Button-4" onClick={e => this.goToComponent(e)}>Senior Strength 415</button>
                            <button className="homeButton" id="Home-Button-1" onClick={e => this.goToComponent(e)}>PE 101</button>
                            <button className="homeButton" id="Home-Button-2" onClick={e => this.goToComponent(e)}>PE 112</button>
                            <button className="homeButton" id="Home-Button-3" onClick={e => this.goToComponent(e)}>PE 211</button>
                            <button className="homeButton" id="Home-Button-4" onClick={e => this.goToComponent(e)}>Senior Strength 415</button>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default Home;


//"react-router-dom": "^6.0.0-alpha.1",
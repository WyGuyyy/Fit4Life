import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './Exercise.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout'
import { Link } from 'react-router-dom';

class Exercise extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            exercise: props.location.state.exercise,
            canGoBack: true
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

    goBack(){ //This isnt working, start here next time
        console.log(this.props);
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }

    //Render the Header component to the DOM/Screen
    render(){

        return(
            <Fragment>
                <Header title={this.state.exercise} goBack={true} customClick={this.goBack.bind(this)}/>
                <div className="exerciseContainer">
                    <Popout />
                    <div className="exerciseWrapper">
                        <form className="exerciseForm">
                            <div className="Exercise-Title-Row">
                                <h2 className="Exercise-Form-Title">Exercise Data</h2>
                            </div>
                            <div className="Exercise-Form-Wrapper">
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Target Heart Rate: </label> <input className="exerciseInput" type="Number" min="0" max="999"/>
                                </div>
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Weight: </label> <input className="exerciseInput" type="Number" min="0" max="999"/>
                                </div>
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Time On: </label> <input className="exerciseInput" type="Number" min="0" max="999" />
                                </div>
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Rest: </label> <input className="exerciseInput" type="Number" min="0" max="999" />
                                </div>
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Sets: </label> <input className="exerciseInput" type="Number" min="0" max="999" />
                                </div>
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Reps: </label> <input className="exerciseInput" type="Number" min="0" max="999" />
                                </div>
                                <div className="Exercise-Details-Row">
                                    <label className="exerciseLabel">Date: </label> <input className="exerciseInput" type="date" min="0" max="999" />
                                </div>
                                <div className="Exercise-Submit-Row">
                                    <button className="exerciseSubmit">Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default Exercise;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
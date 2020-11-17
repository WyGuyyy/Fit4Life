import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './WorkoutDetail.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout'
import { Link, Redirect } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { FaDove } from 'react-icons/fa';
import {RedirectService} from '../_services/RedirectService';

class WorkoutDetail extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(this.props.location.state)){
            this.state = {
                workout: props.location.state.workout,
                canGoBack: props.location.state.goBack
            };
        }

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

        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }

    //Render the Header component to the DOM/Screen
    render(){

            if(!RedirectService.checkItemForUndefined(this.props.location.state)){
                return RedirectService.decideRedirect();
            }

            var exercise = "EXERCISE: " + this.props.location.state.workout.exercise.title;
            var thr = "TARGET HEART RATE: " + this.props.location.state.workout.target_heart_rate;
            var max = "MAX%: " + "MAX";
            //var max = this.props.location.state.workout.max;
            var sets = "SETS: " + this.props.location.state.workout.sets;
            var reps = "REPS: " + this.props.location.state.workout.reps;
            var weight = "WEIGHT: " + this.props.location.state.workout.weight;
            var timeOn = "TIME ON: " + this.props.location.state.workout.time_on_minute + "m " + this.props.location.state.workout.time_on_second + "s";
            var timeOff = "TIME OFF: " + this.props.location.state.workout.rest_minute + "m " + this.props.location.state.workout.rest_second + "s";
            var component = "COMPONENT: " + "FREQUENCY";
            //var component = this.props.location.state.workout.component.title;

            return(

                <Fragment>
                    <Header title="Workout Detail" breadCrumbs="Workout Detail" goBack={true} customClick={this.goBack.bind(this)}/>
                    <div className="Workout-Detail-Container">
                        <Popout />
                        <div className="Workout-Detail-Wrapper">
                            <div className="Workout-Detail-Form-Wrapper">
                                <div className="Workout-Detail-Exercise-Wrapper-Parent">
                                    <div className="Workout-Detail-Exercise-Wrapper" id="Workout-Detail-Exercise-Wrapper">
                                        <h2 className="Workout-Detail-Exercise">{exercise}</h2>
                                    </div>
                                </div>
                                <div className="Workout-Detail-THR-Wrapper-Parent">
                                    <div className="Workout-Detail-THR-Wrapper" id="Workout-Detail-THR-Wrapper">
                                        <h2 className="Workout-Detail-THR">{thr}</h2>
                                    </div>
                                </div>
                                <div className="Workout-Detail-Max-Wrapper-Parent">
                                    <div className="Workout-Detail-Max-Wrapper" id="Workout-Detail-Max-Wrapper">
                                        <h2 className="Workout-Detail-Max">{max}</h2>
                                    </div>
                                </div>
                                <div className="Workout-Detail-Sets-Wrapper-Parent" >
                                    <div className="Workout-Detail-Sets-Wrapper" id="Workout-Detail-Sets-Wrapper">
                                        <h2 className="Workout-Detail-Sets">{sets}</h2>
                                    </div>
                                </div>
                                <div className="Workout-Detail-Reps-Wrapper-Parent">
                                    <div className="Workout-Detail-Reps-Wrapper" id="Workout-Detail-Reps-Wrapper">
                                        <h2 className="Workout-Detail-Reps">{reps}</h2>
                                    </div>
                                </div>
                                <div className="Workout-Detail-Weight-Wrapper-Parent">
                                    <div className="Workout-Detail-Weight-Wrapper" id="Workout-Detail-Weight-Wrapper">
                                        <h2 className="Workout-Detail-Weight">{weight}</h2>
                                    </div>
                                </div>
                                <div className="Workout-Detail-TimeOn-Wrapper-Parent">
                                    <div className="Workout-Detail-TimeOn-Wrapper" id="Workout-Detail-TimeOn-Wrapper">
                                        <h2 className="Workout-Detail-TimeOn">{timeOn}</h2>
                                    </div>
                                </div>
                                <div className="Workout-Detail-TimeOff-Wrapper-Parent">
                                    <div className="Workout-Detail-TimeOff-Wrapper" id="Workout-Detail-TimeOff-Wrapper">
                                        <h2 className="Workout-Detail-TimeOff">{timeOff}</h2>
                                    </div>
                                </div>
                                <div className="Workout-Detail-Component-Wrapper-Parent">
                                    <div className="Workout-Detail-Component-Wrapper" id="Workout-Detail-Component-Wrapper">
                                        <h2 className="Workout-Detail-Component">{component}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            );
            
    }

}

export default WorkoutDetail;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
/*<div className="Goal-Detail-Title-Wrapper">
                            <label className="Goal-Detail-Title-Label">Goal Title: </label> <input className="Goal-Detail-Title-Input" type="text"/>
                        </div>
                        <div className="Goal-Detail-Progress-Wrapper">
                            <label className="Goal-Detail-Progress-Label">Goal Progress: </label> <input className="Goal-Detail-Progress-Input" type="text"/>
                        </div>
                        <div className="Goal-Detail-Description-Wrapper">
                            <label className="Goal-Detail-Description-Label">Goal Detail: </label> <input className="Goal-Detail-Description-Input" type="text"/>
                        </div>*/
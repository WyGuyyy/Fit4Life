import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './GoalDetail.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout'
import { Link } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import {RedirectService} from '../_services/RedirectService';
import {baseURI} from '../_services/APIService';

class GoalDetail extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                canGoBack: props.location.state.goBack,
                goal: props.location.state.goal
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

        var title = this.props.location.state.goal.title;
        var progress = this.props.location.state.goal.progress;
        var content = this.props.location.state.goal.content;
        var progressColor = (progress.localeCompare("Not Started") === 0 ? "#ff0000" : (progress.localeCompare("In Progress") === 0 ? "#fbff00" : "#2bff00"));

        return(
            <Fragment>
                <Header title="Goal Detail" breadCrumbs="Goal Detail" goBack={true} customClick={this.goBack.bind(this)}/>
                <div className="Goal-Detail-Container">
                    <Popout hist={this.props.history}/>
                    <div className="Goal-Detail-Wrapper">
                        <div className="Goal-Detail-Form-Wrapper">
                            <div className="Goal-Detail-Title-Wrapper-Parent">
                                <div className="Goal-Detail-Title-Wrapper">
                                    <h1 className="Goal-Detail-Title">{title}</h1>
                                </div>
                            </div>
                            <div className="Goal-Detail-Progress-Wrapper-Parent">
                                <div className="Goal-Detail-Progress-Wrapper">
                                    <h2 className="Goal-Detail-Progress" style={{color: progressColor}}>{progress}</h2>
                                </div>
                            </div>
                            <div className="Goal-Detail-Description-Wrapper-Parent">
                                <div className="Goal-Detail-Description-Wrapper">
                                    <p className="Goal-Detail-Description">{content}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default GoalDetail;

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
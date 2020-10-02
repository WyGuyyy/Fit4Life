import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './GoalEdit.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout'
import { Link } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

class GoalEdit extends React.Component{
    constructor(props){
        super(props);

        this.state = {
           canGoBack: props.location.state.goBack
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
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }

    //Render the Header component to the DOM/Screen
    render(){

        return(
            <Fragment>
                <Header title="Goal Edit" goBack={true} customClick={this.goBack.bind(this)}/>
                <div className="Goal-Edit-Container">
                    <Popout />
                    <div className="Goal-Edit-Wrapper">
                        <div className="Goal-Edit-Form-Wrapper">
                            <div className="Goal-Edit-Title-Wrapper">
                                <label className="Goal-Edit-Title-Label">Title: </label> <input className="Goal-Edit-Title-Input" placeholder="Title..."/>
                            </div>
                            <div className="Goal-Edit-Progress-Wrapper">
                                <label className="Goal-Edit-Progress-Label">Progress: </label> 
                                <div className="Goal-Edit-Radio-Wrapper">
                                    <div className="Goal-Edit-Not-Started-Radio-Wrapper">
                                        <input className="Goal-Edit-Not-Started-Radio" type="radio" id="notStarted" name="progress" value="not-started"
                                                 />
                                        <label className="Goal-Edit-Not-Started-Label" for="notStarted">NOT STARTED</label>
                                    </div>

                                    <div className="Goal-Edit-In-Progress-Radio-Wrapper">
                                        <input className="Goal-Edit-In-Progress-Radio" type="radio" id="inProgress" name="progress" value="in-progress" />
                                        <label className="Goal-Edit-In-Progress-Label" for="inProgress">IN PROGRESS</label>
                                    </div>

                                    <div className="Goal-Edit-Complete-Radio-Wrapper">
                                        <input className="Goal-Edit-Complete-Radio" type="radio" id="complete" name="progress" value="complete" />
                                        <label className="Goal-Edit-Complete-Label" for="complete">COMPLETE</label>
                                    </div>
                                </div>
                            </div>
                            <div className="Goal-Edit-Description-Wrapper">
                                <label className="Goal-Edit-Description-Label">Description: </label> <textarea className="Goal-Edit-Description-TextArea" placeholder="Description..."/>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default GoalEdit;

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
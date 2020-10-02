import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './GoalDetail.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout'
import { Link } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

class GoalDetail extends React.Component{
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
                <Header title="Goal Detail" goBack={true} customClick={this.goBack.bind(this)}/>
                <div className="Goal-Detail-Container">
                    <Popout />
                    <div className="Goal-Detail-Wrapper">
                        <div className="Goal-Detail-Form-Wrapper">
                            <div className="Goal-Detail-Title-Wrapper">
                                <h1 className="Goal-Detail-Title">Be Fit</h1>
                            </div>
                            <div className="Goal-Detail-Progress-Wrapper">
                                <h2 className="Goal-Detail-Progress">IN PROGRESS</h2>
                            </div>
                            <div className="Goal-Detail-Description-Wrapper">
                                <p className="Goal-Detail-Description">I want to be fit and have like a 6 pack and stuff.</p>
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
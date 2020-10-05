import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './Schedule.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout'
import { Link } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

class Schedule extends React.Component{
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
                <Header title="Schedule" goBack={true} customClick={this.goBack.bind(this)}/>
                <div className="scheduleContainer">
                    <Popout />
                    <div className="scheduleWrapper" id="scheduleWrapper">
                        <div className="scheduleList" id="scheduleList">
                            <div className="scheduleFiller"></div>
                            
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default Schedule;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './ScheduleWeek.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout'
import { Link } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

class ScheduleWeek extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            cellHeight: props.height,
            dayOfWeek: props.dayOfWeek
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

        var dayOfWeek = (this.props.dayOfWeek.localeCompare("Title") === 0 ? "" : this.props.dayOfWeek);

        return(

            <div className="ScheduleWeek-Row-Wrapper" style={{height: this.state.cellHeight}}>
                <div className="ScheduleWeek-Day">
                    <p className="ScheduleWeek-Day-Content">{dayOfWeek}</p>
                </div>
                <div className="ScheduleWeek-Type">
                    <p className="ScheduleWeek-Type-Content">Running</p>
                </div>
                <div className="ScheduleWeek-THR">
                    <p className="ScheduleWeek-THR-Content">90</p>
                </div>
                <div className="ScheduleWeek-Max">
                    <p className="ScheduleWeek-Max-Content">12</p>
                </div>
                <div className="ScheduleWeek-Sets">
                    <p className="ScheduleWeek-Sets-Content">5</p>
                </div>
                <div className="ScheduleWeek-Reps">
                    <p className="ScheduleWeek-Reps-Content">10</p>
                </div>
                <div className="ScheduleWeek-Weight">
                    <p className="ScheduleWeek-Weight-Content">100</p>
                </div>
                <div className="ScheduleWeek-TimeOn">
                    <p className="ScheduleWeek-TimeOn-Content">60</p>
                </div>
                <div className="ScheduleWeek-TimeOff">
                    <p className="ScheduleWeek-TimeOff-Content">60</p>
                </div>
                <div className="ScheduleWeek-Frequency">
                    <p className="ScheduleWeek-Frequency-Content">Cardio</p>
                </div>
            </div>                    
                                
        );
            
    }
}

export default ScheduleWeek;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
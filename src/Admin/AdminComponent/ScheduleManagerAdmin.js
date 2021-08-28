import React, { Fragment } from 'react';
import './ScheduleManagerAdmin.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout'
import ConfirmModal from '../../Confirm/ConfirmModal';
import ConfirmToast from '../../Confirm/ConfirmToast';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import {RedirectService} from '../../_services/RedirectService';
import {FaArrowDown} from 'react-icons/fa';
import {baseURI} from '../../_services/APIService';
import { parse } from '@fortawesome/fontawesome-svg-core';

class ScheduleManagerAdmin extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                canGoBack: true,
                idMap: [],
                selectedPath: [],
                listIds: ["Category-Admin-List-Wrapper-0"],
                arrowIds: ["Category-Admin-List-Arrow-0"]
            }
        }

    }
    
    async componentDidMount(){ 
        
    }

    componentWillUnmount(){
        
    }

    

    closeModal(){
        document.getElementById("modalContainer").style.display = "none";
    }

    displayMessage(textValue){
        // Get the snackbar confirmation
        var confirmation = document.getElementById("snackbar");
        confirmation.textContent = textValue;
        confirmation.className = "show";
        setTimeout(function(){ confirmation.className = confirmation.className.replace("show", ""); }, 3000);
    }

    goBack(){ //This isnt working, start here next time
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }
    
    render(){

        var classroom = this.props.location.state.classroom.title;

        return(

            <div className="Scheduler-Admin-Container">
                <AdminHeader title={"Scheduling"} breadCrumbs={"Scheduling for " + classroom} goBack={true} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Delete exercise?" yesText="Yes" noText="No" onYes={e => {this.deleteExercise(); this.closeModal(); this.confirmBackendTransaction();}}/>
                <LoadingSpinner />
                <AdminPopout hist={this.props.history}/>
                <ConfirmToast text="Exercise created!"/>

                <div className="Scheduler-Admin-Wrapper">

                    <div className="Scheduler-Admin-Date-Wrapper">
                        
                        <div className="Scheduler-Admin-Start-Date-Wrapper">
                            <label className="Scheduler-Admin-Start-Date-Label">Start Date</label>
                            <input className="Scheduler-Admin-Start-Date" type="date"/>
                        </div>

                        <div className="Scheduler-Admin-End-Date-Wrapper">
                            <label className="Scheduler-Admin-End-Date-Label">End Date</label>
                            <input className="Scheduler-Admin-End-Date" type="date"/>
                        </div>

                    </div>

                    <div className="Scheduler-Admin-Switch-Wrapper">
                        <div className="Scheduler-Admin-Switch-InnerWrapper">
                            <h2 className="Scheduler-Admin-H2-E"><i className="fa fa-child" title="Exercises" style={{fontSize: "40px"}}/></h2>
                            <label className="switch">
                                <input type="checkbox"/>
                                <span className="slider round"></span>
                            </label>
                            <h2 className="Scheduler-Admin-H2-C"><i className="fa fa-folder" title="Categories" style={{fontSize: "40px"}}/></h2>
                        </div>
                    </div>

                    <div className="Scheduler-Admin-List-Wrapper">
                        <div className="Scheduler-Admin-List">
                            
                        </div>
                    </div>

                </div>

            </div>
        );
            
    }
}

export default ScheduleManagerAdmin;


//"react-router-dom": "^6.0.0-alpha.1",
//<div className="exerciseFiller-Admin"></div>
/*<FaArrowDown color='black' size='10rem' style={{height: "100px", width: "70px"}}/>

                    <i className="fa fa-arrow-down" style={{fontSize: "100px"}}></i> */

                    /*<div className="Category-Admin-ListItem-Wrapper">
                                <h2 className="Category-Admin-ListItem">Strength</h2>
                            </div> */
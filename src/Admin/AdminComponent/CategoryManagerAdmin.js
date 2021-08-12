import React, { Fragment } from 'react';
import './CategoryManagerAdmin.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout'
import ConfirmModal from '../../Confirm/ConfirmModal';
import ConfirmToast from '../../Confirm/ConfirmToast';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import {RedirectService} from '../../_services/RedirectService';
import {FaArrowDown} from 'react-icons/fa';
import {baseURI} from '../../_services/APIService';

class CategoryManagerAdmin extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                canGoBack: true
            }
        }

    }
    
    componentDidMount(){ 

    }

    componentWillUnmount(){
        
    }

    showModal(eventObj){

        var idNum = eventObj.event.target.id.split("-")[1];
        var aExercise = this.state.componentExercises[idNum];

        this.setState({
            focusedExercise: aExercise,
            focusedExerciseItemID: idNum
        });

        document.getElementById("modalContainer").style.display = "flex";
    }

    closeModal(){
        document.getElementById("modalContainer").style.display = "none";
    }

    confirmBackendTransaction(){
        // Get the snackbar confirmation
        var confirmation = document.getElementById("snackbar");
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

            <div className="Category-Admin-Container">
                <AdminHeader title={"Categories"} breadCrumbs={classroom + " Categories"} goBack={true} customClick={this.goBack.bind(this)}/>
                <ConfirmModal text="Delete exercise?" yesText="Yes" noText="No" onYes={e => {this.deleteExercise(); this.closeModal(); this.confirmBackendTransaction();}}/>
                <LoadingSpinner />
                <AdminPopout hist={this.props.history}/>

                <div className="Category-Admin-Wrapper">
                    <div className="Category-Admin-Classroom-Wrapper">
                        <div className="Category-Admin-Classroom">
                            <h1 className="Category-Admin-Classroom-Title">{classroom}</h1>
                        </div>
                    </div>

                    <i className="fa fa-arrow-down Category-Admin-Arrow" style={{fontSize: "120px"}}></i>

                    <div className="Category-Admin-List-Wrapper">
                        <div className="Category-Admin-List">
                            <div className="Category-Admin-ListItem-Wrapper">
                                <h2 className="Category-Admin-ListItem">Strength</h2>
                            </div>

                            <div className="Category-Admin-ListItem-Wrapper">
                                <h2 className="Category-Admin-ListItem">Aerobic</h2>
                            </div>

                            <div className="Category-Admin-ListItem-Wrapper">
                                <h2 className="Category-Admin-ListItem">Speed</h2>
                            </div>

                            <div className="Category-Admin-ListItem-Wrapper">
                                <h2 className="Category-Admin-ListItem">Sport</h2>
                            </div>

                            <div className="Category-Admin-ListItem-Wrapper">
                                <h2 className="Category-Admin-ListItem">Sport</h2>
                            </div>

                            <div className="Category-Admin-ListItem-Wrapper">
                                <h2 className="Category-Admin-ListItem">Sport</h2>
                            </div>

                            <div className="Category-Admin-ListItem-Wrapper">
                                <h2 className="Category-Admin-ListItem">Sport</h2>
                            </div>

                            <div className="Category-Admin-ListItem-Wrapper">
                                <h2 className="Category-Admin-ListItem">Sport</h2>
                            </div>
                            
                        </div>
                        <div className="Category-Admin-Button-Wrapper">
                            <button className="Category-Admin-Add-Button">+</button>
                            <button className="Category-Admin-Subtract-Button">-</button>
                        </div>
                    </div>
                    
                    

                </div>

            </div>
        );
            
    }
}

export default CategoryManagerAdmin;


//"react-router-dom": "^6.0.0-alpha.1",
//<div className="exerciseFiller-Admin"></div>
/*<FaArrowDown color='black' size='10rem' style={{height: "100px", width: "70px"}}/>

                    <i className="fa fa-arrow-down" style={{fontSize: "100px"}}></i> */
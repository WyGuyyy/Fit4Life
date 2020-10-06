import React, { Fragment } from 'react';
import './AdminHome.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout'
import { Link } from 'react-router-dom';

class AdminHome extends React.Component{
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
                <AdminHeader title="Admin Home" goBack={false} customClick={this.goBack.bind(this)}/>
                <div className="homeContainer">
                    <AdminPopout />
                    <button className="Classroom-Create-Button-Admin" title="Create Classroom" onClick={(e)=>this.goToGoalCreate({event: e})}>+</button>
                    <div className="classroomWrapper-Admin" id="classroomWrapper-Admin">
                        <div className="classroomList-Admin" id="classroomList-Admin">
                            <div className="classroomFiller-Admin"></div>
                            
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default AdminHome;


//"react-router-dom": "^6.0.0-alpha.1",
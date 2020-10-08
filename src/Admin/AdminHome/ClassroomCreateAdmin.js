import React, { Fragment } from 'react';
import './ClassroomCreateAdmin.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout'
import { Link } from 'react-router-dom';

class ClassroomCreateAdmin extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            canGoBack: true
        }

    }
    
    componentDidMount(){ 
        
    }

    componentWillUnmount(){
        
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
                <AdminHeader title="Admin Classroom Create" goBack={true} customClick={this.goBack.bind(this)}/>
                <div className="Classroom-Create-Container-Admin">
                    <AdminPopout />
                    <div className="Classroom-Create-Wrapper-Admin">
                        <div className="Classroom-Create-Form-Wrapper-Admin">
                            <div className="Classroom-Create-Title-Wrapper-Admin">
                                <label className="Classroom-Create-Title-Label-Admin">Classroom Title: </label> <input className="Classroom-Create-Title-Input-Admin" placeholder="Title..."/>
                            </div>
                            <div className="Classroom-Create-Button-Area-Admin"> 
                                <button className="Classroom-Create-Save-Button-Admin">Create</button>
                                <button className="Classroom-Create-Cancel-Button-Admin">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default ClassroomCreateAdmin;


//"react-router-dom": "^6.0.0-alpha.1",
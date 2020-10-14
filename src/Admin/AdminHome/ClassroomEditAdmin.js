import React, { Fragment } from 'react';
import './ClassroomEditAdmin.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout'
import { Link } from 'react-router-dom';

class ClassroomEditAdmin extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            canGoBack: true,
            classroomTitle: props.location.state.title
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
                <AdminHeader title="Admin Classroom Edit" goBack={true} customClick={this.goBack.bind(this)}/>
                <div className="Classroom-Edit-Container-Admin">
                    <AdminPopout />
                    <div className="Classroom-Edit-Wrapper-Admin">
                        <div className="Classroom-Edit-Form-Wrapper-Admin">
                            <div className="Classroom-Edit-Title-Wrapper-Admin">
                                <label className="Classroom-Edit-Title-Label-Admin">Classroom Title: </label> <input className="Classroom-Edit-Title-Input-Admin" defaultValue={this.props.location.state.title}/>
                            </div>
                            <div className="Classroom-Edit-Button-Area-Admin"> 
                                <button className="Classroom-Edit-Save-Button-Admin">Save</button>
                                <button className="Classroom-Edit-Cancel-Button-Admin">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default ClassroomEditAdmin;


//"react-router-dom": "^6.0.0-alpha.1",
import React, { Fragment } from 'react';
import './ExerciseCreateAdmin.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout'
import { Link } from 'react-router-dom';

class ExerciseCreateAdmin extends React.Component{
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
                <AdminHeader title="Exercise Create" goBack={true} customClick={this.goBack.bind(this)}/>
                <div className="Exercise-Create-Container-Admin">
                    <AdminPopout />
                    <div className="Exercise-Create-Wrapper-Admin">
                        <div className="Exercise-Create-Form-Wrapper-Admin">
                            <div className="Exercise-Create-Title-Wrapper-Admin">
                                <label className="Exercise-Create-Title-Label-Admin">Exercise Title: </label> <input className="Exercise-Create-Title-Input-Admin" placeholder="Title..."/>
                            </div>
                            <div className="Exercise-Create-Button-Area-Admin"> 
                                <button className="Exercise-Create-Save-Button-Admin">Create</button>
                                <button className="Exercise-Create-Cancel-Button-Admin">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default ExerciseCreateAdmin;


//"react-router-dom": "^6.0.0-alpha.1",
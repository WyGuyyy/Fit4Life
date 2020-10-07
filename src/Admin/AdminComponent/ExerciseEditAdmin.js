import React, { Fragment } from 'react';
import './ExerciseEditAdmin.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout'
import { Link } from 'react-router-dom';

class ExerciseEditAdmin extends React.Component{
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
                <AdminHeader title="Exercise Edit" goBack={true} customClick={this.goBack.bind(this)}/>
                <div className="Exercise-Edit-Container-Admin">
                    <AdminPopout />
                    <div className="Exercise-Edit-Wrapper-Admin">
                        <div className="Exercise-Edit-Form-Wrapper-Admin">
                            <div className="Exercise-Edit-Title-Wrapper-Admin">
                                <label className="Exercise-Edit-Title-Label-Admin">Exercise Title: </label> <input className="Exercise-Edit-Title-Input-Admin" placeholder="Title..."/>
                            </div>
                            <div className="Exercise-Edit-Button-Area-Admin"> 
                                <button className="Exercise-Edit-Save-Button-Admin">Save</button>
                                <button className="Exercise-Edit-Cancel-Button-Admin">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default ExerciseEditAdmin;


//"react-router-dom": "^6.0.0-alpha.1",
import React, { Fragment } from 'react';
import './ComponentEditAdmin.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout'
import { Link } from 'react-router-dom';

class ComponentEditAdmin extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            canGoBack: true,
            title: props.location.state.title
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
                <AdminHeader title="Admin Component Edit" goBack={true} customClick={this.goBack.bind(this)}/>
                <div className="Component-Edit-Container-Admin">
                    <AdminPopout />
                    <div className="Component-Edit-Wrapper-Admin">
                        <div className="Component-Edit-Form-Wrapper-Admin">
                            <div className="Component-Edit-Title-Wrapper-Admin">
                                <label className="Component-Edit-Title-Label-Admin">Component Title: </label> <input className="Classroom-Edit-Title-Input-Admin" defaultValue={this.props.location.state.title}/>
                            </div>
                            <div className="Component-Edit-Button-Area-Admin"> 
                                <button className="Component-Edit-Save-Button-Admin">Save</button>
                                <button className="Component-Edit-Cancel-Button-Admin">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default ComponentEditAdmin;


//"react-router-dom": "^6.0.0-alpha.1",
import React, { Fragment } from 'react';
import './ComponentCreateAdmin.css';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopout from '../AdminPopout/AdminPopout'
import { Link } from 'react-router-dom';

class ComponentCreateAdmin extends React.Component{
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
                <AdminHeader title="Component Create" goBack={true} customClick={this.goBack.bind(this)}/>
                <div className="Component-Create-Container-Admin">
                    <AdminPopout />
                    <div className="Component-Create-Wrapper-Admin">
                        <div className="Component-Create-Form-Wrapper-Admin">
                            <div className="Component-Create-Title-Wrapper-Admin">
                                <label className="Component-Create-Title-Label-Admin">Classroom Title: </label> <input className="Classroom-Create-Title-Input-Admin" placeholder="Title..."/>
                            </div>
                            <div className="Component-Create-Button-Area-Admin"> 
                                <button className="Component-Create-Save-Button-Admin">Create</button>
                                <button className="Component-Create-Cancel-Button-Admin">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default ComponentCreateAdmin;


//"react-router-dom": "^6.0.0-alpha.1",
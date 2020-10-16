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

    async createComponent(event){

        var aTitle = document.getElementById("Component-Create-Title-Input-Admin").value;

        await fetch("http://localhost:8080/api/component", {  
            method: "POST",                          
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title: aTitle}) //Need to add in other fields here, back end and front end
        }).catch(console.log);

        document.getElementById("Component-Create-Title-Input-Admin").value = "";

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
                <AdminHeader title="Admin Component Create" goBack={true} customClick={this.goBack.bind(this)}/>
                <div className="Component-Create-Container-Admin">
                    <AdminPopout />
                    <div className="Component-Create-Wrapper-Admin">
                        <div className="Component-Create-Form-Wrapper-Admin">
                            <div className="Component-Create-Title-Wrapper-Admin">
                                <label className="Component-Create-Title-Label-Admin">Component Title: </label> <input className="Component-Create-Title-Input-Admin" id="Component-Create-Title-Input-Admin" placeholder="Title..."/>
                            </div>
                            <div className="Component-Create-Button-Area-Admin"> 
                                <button className="Component-Create-Save-Button-Admin" onClick={(e) => this.createComponent(e)}>Create</button>
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
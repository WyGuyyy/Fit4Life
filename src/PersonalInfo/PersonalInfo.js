import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './PersonalInfo.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout'
import { Link } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';

class PersonalInfo extends React.Component{
    constructor(props){
        super(props);

        this.state = {
           canGoBack: props.location.state.goBack
        };

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
        
    }

    componentDidUpdate(){

    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    goToPersonalInfoEdit(e){
        this.props.history.push({
            pathname: "/personalEdit",
            state: {goBack: true}
        });
    }

    goBack(){ //This isnt working, start here next time
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }

    //Render the Header component to the DOM/Screen
    render(){

        return(
            <Fragment>
                <Header title="Personal Info" goBack={true} customClick={this.goBack.bind(this)}/>
                <div className="Personal-Info-Container">
                    <Popout />
                    <div className="Personal-Info-Wrapper" id="Personal-Info-Wrapper">
                        <div className="Personal-Info-Form-Wrapper">

                            <div className="Personal-Info-Title-Wrapper">
                                <h2 className="Personal-Info-Form-Title">My Information</h2>
                            </div>

                            <div className="Personal-Info-First-Name-Wrapper">
                                <label className="Personal-Info-First-Name-Label">First Name: </label> <h2 className="Personal-Info-First-Name">Nothing</h2>
                            </div>

                            <div className="Personal-Info-Last-Name-Wrapper">
                                <label className="Personal-Info-Last-Name-Label">Last Name: </label> <h2 className="Personal-Info-Last-Name">Nothing</h2>
                            </div>

                            <div className="Personal-Info-Email-Wrapper">
                                <label className="Personal-Info-Email-Label">Email: </label> <h2 className="Personal-Info-Email">Nothing</h2>
                            </div>

                            <div className="Personal-Info-Weight-Wrapper">
                                <label className="Personal-Info-Weight-Label">Weight: </label> <h2 className="Personal-Info-Weight">Nothing</h2>
                            </div>

                            <div className="Personal-Info-Height-Wrapper">
                                <label className="Personal-Info-Height-Label">Height: </label> <h2 className="Personal-Info-Height">Nothing</h2>
                            </div>

                            <div className="Personal-Info-Edit-Button-Wrapper">
                                 <button className="Personal-Info-Edit-Button" onClick={(e) => this.goToPersonalInfoEdit(e)}>Edit</button>
                            </div>

                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default PersonalInfo;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
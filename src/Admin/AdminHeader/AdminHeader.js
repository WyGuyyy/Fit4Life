import React from 'react';
import './AdminHeader.css';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import MMS_Title from './MMS_Title';
import Hamburger from './Hamburger';
import lhs_logo from '../../Assets/lhs_logo.png';

class Header extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            logoSelected: false,  
            title: props.title,
            menuPop: false,
            canGoBack: (props.goBack == undefined ? false : true)
        };

        this.goBack = this.goBack.bind(this);
    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
    
    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    transformLogo(){
        var logo = document.getElementsByClassName("lhsLogo")[0];

        console.log(logo);

        if(this.state.logoSelected){        
            
            this.setState({
                logoSelected: false
            });

            logo.style.transform = "rotate(360deg)";
            this.closeMenu();

        }else{
            
            this.setState({
                logoSelected: true
            });

            logo.style.transform = "rotate(-360deg)";
            this.openMenu();

        }
    }

    openMenu(){

        var popout = document.getElementsByClassName("popoutContainer")[0];
        popout.classList.remove("popoutWrapper-goUp");
        popout.classList.add("popoutWrapper-goDown");
        //
        //popout.style.visibility = "visbile";
        /*popout.style.transform = "scale(1)";
        popout.style.transitionDuration = "0.75s";
        popout.style.opacity = "1";
        popout.style.transition = "opacity 0.4s ease";*/

    }

    closeMenu(){
        var popout = document.getElementsByClassName("popoutContainer")[0];
        popout.classList.remove("popoutWrapper-goDown");
        popout.classList.add("popoutWrapper-goUp");
        //popout.className = popout.className;
        //popout.style.visibility = "hidden";
    }

    goToHome(){
        this.props.history.push('/');
    }

    goBack(){ //This isnt working, start here next time
        console.log(this.props);
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }

    //Render the Header component to the DOM/Screen
    render(){

        return(
                <div className="headerContainer-Admin" >
                    <div className="headerWrapper-Admin">
                        <div className="hamburgerContainer-Admin">
                            <img src={lhs_logo} className="lhsLogo-Admin" height="75px" onClick={this.transformLogo.bind(this)}/>
                        </div>
                        <div className="Page-Title-Container-Admin">
                            <p className="backArrowBackground-Admin">
                                <i className="arrow-Admin up-Admin" onClick={() => this.goBack()}/>
                            </p>
                            <h1 className="pageTitle-Admin">{this.state.title}</h1>
                        </div>
                        <div className="MMS-Title-Container-Admin">
                            <Link to="/" className="titleLink-Admin">
                                <MMS_Title />
                            </Link>
                        </div>
                    </div>
                </div>
        );
            
    }
}

export default Header;

//<Hamburger />

//"react-router-dom": "^6.0.0-alpha.1",
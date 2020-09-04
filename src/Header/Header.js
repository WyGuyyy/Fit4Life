import React from 'react';
import './Header.css';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import MMS_Title from './MMS_Title';
import Hamburger from './Hamburger';
import lhs_logo from '../Assets/lhs_logo.png';

class Header extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            logoSelected: false,  
            title: props.title
        };
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

        var popout = document.getElementsByClassName("popoutWrapper")[0];
        popout.classList.add(".popoutWrapper-scaleDown");
        console.log(popout.classList);
        //popout.style.visibility = "visbile";
        /*popout.style.transform = "scale(1)";
        popout.style.transitionDuration = "0.75s";
        popout.style.opacity = "1";
        popout.style.transition = "opacity 0.4s ease";*/

    }

    closeMenu(){
        var popout = document.getElementsByClassName("popoutWrapper")[0];
        popout.classList.remove(".popoutWrapper-scaleDown");
        popout.className = popout.className;
        //popout.style.visibility = "hidden";
    }

    goToHome(){
        console.log(this);
        this.props.history.push('/');
    }

    //Render the Header component to the DOM/Screen
    render(){

        return(
            <div className="headerContainer">
                <div className="hamburgerContainer">
                    <img src={lhs_logo} className="lhsLogo" height="75px" onClick={this.transformLogo.bind(this)}/>
                </div>
                <div className="Page-Title-Container">
                    <h1 className="pageTitle">{this.state.title}</h1>
                </div>
                <div className="MMS-Title-Container">
                    <Link to="/" className="titleLink">
                        <MMS_Title />
                    </Link>
                </div>
            </div>
        );
            
    }
}

export default Header;

//<Hamburger />

//"react-router-dom": "^6.0.0-alpha.1",
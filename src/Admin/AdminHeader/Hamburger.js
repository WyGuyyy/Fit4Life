import React from 'react';
import './Hamburger.css';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

class Hamburger extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            hamSelected: false //State of hamburger button
        };

    }
    
    //Lifecycle method for after hamburger component has mounted to the DOM
    componentDidMount(){ 
    
        var elArr = document.getElementsByClassName('hamburgerWrapper');
        var hamburgerButton = elArr[0];
        hamburgerButton.onclick = this.transformHamburger.bind(this);

    }

    //Lifecycle event preparing hamburger component to unmount from DOM
    componentWillUnmount(){
        
    }

    //transformHamburger() will transform the hamburger bars when it is clicked or
    //deselected. This is tracked in the hamSelected state variable
    transformHamburger(){
        var bar1 = document.getElementsByClassName("hamburger-bar-1")[0];
        var bar2 = document.getElementsByClassName("hamburger-bar-2")[0];
        var bar3 = document.getElementsByClassName("hamburger-bar-3")[0];

        if(this.state.hamSelected){
            this.setState({
                hamSelected: false
            });

            bar1.style.transform = "rotate(0deg)";
            bar2.style.opacity = "1";
            bar3.style.transform = "rotate(0deg)";

        }else{
            this.setState({
                hamSelected: true
            });

            bar1.style.transform = "rotate(-45deg) translateY(20px)";
            bar2.style.opacity = "0";
            bar3.style.transform = "rotate(45deg) translateY(-22px)";

        }
    }
    
    //render the Hamburger component to the DOM/screen
    render(){

        return(
            <div className="hamburgerWrapper">
                <div className="hamburger-bar-1"></div>
                <div className="hamburger-bar-2"></div>
                <div className="hamburger-bar-3"></div>
            </div>
        );
            
    }
}

export default Hamburger;


//"react-router-dom": "^6.0.0-alpha.1",
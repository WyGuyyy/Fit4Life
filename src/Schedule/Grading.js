import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './Grading.css';

class Grading extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            selectedDate: props.date
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

    onHandleGradingPopout(event){
        
        var gradingWrapper = document.getElementsByClassName("Grading-Wrapper")[0];
        var arrow = document.getElementsByClassName("Grading-Arrow-Icon")[0];
        
        if(gradingWrapper.classList.contains("popout")){
            gradingWrapper.classList.remove("popout");
            gradingWrapper.classList.add("hidden");
            arrow.style.transform = "rotate(0deg)";

        }else{
            gradingWrapper.classList.remove("hidden");
            gradingWrapper.classList.add("popout");
            arrow.style.transform = "rotate(180deg)";
        }

    }

    onGradeChange(event){
        
        var input = event.target;
        var id = input.id;
        var grade = input.value;
        var date = new Date(this.props.date);
        console.log(this.props.date);

        if(!date){
            return;
        }
        console.log(id);
        var daysToAdd = parseInt(id.split("-")[2]) - 1;
        date.setDate(date.getDate() + daysToAdd);

        console.log(date.getUTCDate());

    }

    //Render the Header component to the DOM/Screen
    render(){

            return(

                    <div className="Grading-Wrapper">

                        <div className="Grading-Title-Wrapper">
                            <div className="Grading-Arrow" onClick={e => this.onHandleGradingPopout(e)}>
                                <i className="fa fa-arrow-left Grading-Arrow-Icon"> </i>
                            </div>
                            <label className="Grading-Title-Label">Grades</label>
                        </div>

                        <div className="Grading-Day-Wrapper">
                            <input className="Grading-Input" id="Grading-Input-1" onChange={e => this.onGradeChange(e)}></input>
                        </div>

                        <div className="Grading-Day-Wrapper">
                            <input className="Grading-Input" id="Grading-Input-2" onChange={e => this.onGradeChange(e)}></input>
                        </div>

                        <div className="Grading-Day-Wrapper">
                            <input className="Grading-Input" id="Grading-Input-2" onChange={e => this.onGradeChange(e)}></input>
                        </div>

                        <div className="Grading-Day-Wrapper">
                            <input className="Grading-Input" id="Grading-Input-3" onChange={e => this.onGradeChange(e)}></input>
                        </div>

                        <div className="Grading-Day-Wrapper">
                            <input className="Grading-Input" id="Grading-Input-4" onChange={e => this.onGradeChange(e)}></input>
                        </div >
                            
                        <div className="Grading-Total-Wrapper">
                            <input className="Grading-Input" id="Grading-Input-5" readOnly></input>
                        </div>

                    </div>

            );
            
    }

}

export default Grading;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
/*<div className="Goal-Detail-Title-Wrapper">
                            <label className="Goal-Detail-Title-Label">Goal Title: </label> <input className="Goal-Detail-Title-Input" type="text"/>
                        </div>
                        <div className="Goal-Detail-Progress-Wrapper">
                            <label className="Goal-Detail-Progress-Label">Goal Progress: </label> <input className="Goal-Detail-Progress-Input" type="text"/>
                        </div>
                        <div className="Goal-Detail-Description-Wrapper">
                            <label className="Goal-Detail-Description-Label">Goal Detail: </label> <input className="Goal-Detail-Description-Input" type="text"/>
                        </div>*/
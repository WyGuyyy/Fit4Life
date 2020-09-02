import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './Component.css';
import Header from '../Header/Header';
import ExerciseTile from './ExerciseTile'
import { Link } from 'react-router-dom';

class Component extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            component: props.location.state.component
        };

        window.addEventListener("resize", this.triggerRerender.bind(this));

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
        this.renderTiles();
    }

    componentDidUpdate(){
        this.renderTiles();
    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    triggerRerender(){
        this.setState({
            triggerRerender: true
        });
    }

    renderTiles(){

        var tempNumOfTiles = 40;
        var numRows;

        var tempArr = ["hi", "hi", "hi", "hi", "hi", "hi", "hi", "hi", "hi", "hi", "hi", "hi", "hi", "hi", "hi", "hi", "hi", "hi"]

        var componentWrapper = document.getElementById("componentWrapper");
        componentWrapper.innerHTML = '';

        var aTile;
        var aFlexRow;
        var countOuter;
        var countInner;

        var tilesPerRow = this.calculateRowCount();
        numRows = Math.ceil(tempArr.length/tilesPerRow);

        console.log(tilesPerRow);

        for(countOuter = 0; countOuter < numRows; countOuter++){
            
            aFlexRow = document.createElement('div');
            aFlexRow.className = "Component-Tile-Wrapper";

            for(countInner = 0; countInner < tilesPerRow; countInner++){

                aTile = ReactDom.render(this.renderTileRow(tempArr.slice(countOuter*tilesPerRow, countOuter*tilesPerRow + tilesPerRow)), aFlexRow);
                //ReactDOM.render(aTile, aFlexRow);
            }

            componentWrapper.appendChild(aFlexRow);
        }


    }

    renderTileRow(tempArr){
        return tempArr.map(this.renderTile);
    }

    renderTile(tempExercise){
        return <ExerciseTile exercise={tempExercise} />
    }


    calculateRowCount(){
        var viewportWidth = window.innerWidth;

        if(viewportWidth >= 1440){
            return 4;
        }else if(viewportWidth >= 1024){
            return 3;
        }else{
            return 2;
        }
    }

    //Render the Header component to the DOM/Screen
    render(){

        return(
            <Fragment>
                <Header title={this.state.component}/>
                <div className="componentContainer">
                    <div className="componentWrapper" id="componentWrapper">
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default Component;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
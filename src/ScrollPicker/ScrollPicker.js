import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './ScrollPicker.css';
import Header from '../Header/Header';
import Popout from '../Popout/Popout';
import ConfirmModal from '../Confirm/ConfirmModal';
import ConfirmToast from '../Confirm/ConfirmToast';
import { Link } from 'react-router-dom';
import {RedirectService} from '../_services/RedirectService';
import {DataCheckService} from '../_services/DataCheckService';
import {baseURI} from '../_services/APIService';

class ScrollPicker extends React.Component{
    constructor(props){
        super(props);

       // if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                columnTitles: props.columnTitles,
                columnItems: props.columnItems,
                controlWrapperID: props.controlWrapperID
            };
        //}

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
        this.renderColumns();
    }

    componentDidUpdate(){

    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    renderColumns(){
        var titles = this.props.columnTitles;
        var items = this.props.columnItems;
        var id = this.props.controlWrapperID;
        var titleCount = 0;
        var itemCount = 0;

        var columnWrapper = "";
        var columnDiv = "";
        var columnTitle = "";
        var itemWrapper = "";
        var item = "";
        var pickerArr = [];

        var controlWrapper = document.getElementById(id);

        for(titleCount = 0; titleCount < titles.length; titleCount++){
            
            columnWrapper = document.createElement("div");
            columnTitle = document.createElement("h2");
            columnDiv = document.createElement("div");

            columnDiv.classList.add("Picker-ColumnDiv");

            columnTitle.classList.add("Picker-ColumnTitle");
            columnTitle.textContent = titles[titleCount];

            columnWrapper.classList.add("Picker-ColumnWrapper");
            columnWrapper.appendChild(columnTitle);

            for(itemCount = 0; itemCount < items[titleCount].length; itemCount++){
                itemWrapper = document.createElement("div");
                item = document.createElement("h1");

                itemWrapper.classList.add("Picker-ItemWrapper");
                item.classList.add("Picker-Item");

                itemWrapper.id = titles[titleCount] + "Wrapper-" + itemCount;
                itemWrapper.onclick = e => this.onItemClick(e);
                item.id = titles[titleCount] + "-" + itemCount;

                item.textContent = items[titleCount][itemCount];
                console.log(items);

                itemWrapper.appendChild(item);
                columnDiv.appendChild(itemWrapper);
            }

            columnWrapper.appendChild(columnDiv);
            controlWrapper.appendChild(columnWrapper);

        }

    }

    onItemClick(event){
        var id = event.target.id;
        var idNum = id.split("-")[1];
        var columnTitles = this.state.columnTitles;
        var count = 0;

        var titleToBeFound = "";

        for(count = 0; count < columnTitles.length; count++){
            if(id.includes(columnTitles[count])){
                titleToBeFound = columnTitles[count];
                break;
            }
        }

        var itemWrapper = document.getElementById(titleToBeFound + "Wrapper-" + parseInt(idNum));
        itemWrapper.style.background = "radial-gradient(#6b4e00, #000000)";
    }

    //Render the Header component to the DOM/Screen
    render(){

        return(
            <Fragment>
                <div className="Scroll-Picker-Container">
                    <div className="Scroll-Picker-Wrapper" id={this.props.controlWrapperID}>

                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default ScrollPicker;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
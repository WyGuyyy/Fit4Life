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
                controlWrapperID: props.controlWrapperID,
                selectedItem: [],
                transform: [],
                selected: []
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
        var columnScrollDiv = "";
        var columnTitle = "";
        var itemWrapper = "";
        var item = "";
        var pickerArr = [];

        var transforms = this.state.transform;
        var newSelected = this.state.selected;
        var newSelectedItem = this.state.selectedItem;

        var controlWrapper = document.getElementById(id);

        for(titleCount = 0; titleCount < titles.length; titleCount++){
            
            transforms.push(0);
            newSelected.push(-1);
            newSelectedItem.push("");

            columnWrapper = document.createElement("div");
            columnTitle = document.createElement("h2");
            columnDiv = document.createElement("div");
            columnScrollDiv = document.createElement("div");

            columnDiv.classList.add("Picker-ColumnDiv");
            //columnDiv.id = "Picker-ColumnDiv-" + titles[titleCount];
            //columnDiv.onwheel = e => this.controlScroll(e);
            columnScrollDiv.onwheel = e => this.controlScroll(e);

            columnScrollDiv.classList.add("Picker-ColumnScrollDiv");
            columnScrollDiv.id = "Picker-ColumnScrollDiv-" + id + "-" + titles[titleCount];

            columnTitle.classList.add("Picker-ColumnTitle");
            columnTitle.textContent = titles[titleCount];

            columnWrapper.classList.add("Picker-ColumnWrapper");
            columnWrapper.appendChild(columnTitle);

            for(itemCount = 0; itemCount < items[titleCount].length; itemCount++){
                itemWrapper = document.createElement("div");
                item = document.createElement("h1");

                itemWrapper.classList.add("Picker-ItemWrapper");
                item.classList.add("Picker-Item");

                itemWrapper.id = titles[titleCount] + "Wrapper-" + id + "-" + itemCount;
                itemWrapper.onclick = e => this.onItemClick(e);
                item.id = titles[titleCount] + "-" + id + "-" + itemCount;
                item.textContent = items[titleCount][itemCount];
                console.log(items);

                itemWrapper.appendChild(item);
                columnScrollDiv.appendChild(itemWrapper);
            }

            columnDiv.appendChild(columnScrollDiv);
            columnWrapper.appendChild(columnDiv);
            controlWrapper.appendChild(columnWrapper);

        }

        this.setState({
            transform: transforms,
            selected: newSelected,
            selectedItem: newSelectedItem
        });

    }

    //Need to refactor below methods
    controlScroll(event){
        var id = event.target.id;
        var idType = id.split("-")[0].replace("Wrapper", "");
        var newTransforms = this.state.transform;
        var index = this.state.columnTitles.indexOf(idType);

        var controlWrapperID = this.state.controlWrapperID;
        var scroller = document.getElementById("Picker-ColumnScrollDiv-" + controlWrapperID + "-" + idType);
        var newTransform = (event.deltaY < 0 ? newTransforms[index] + 100 : newTransforms[index] - 100);

        var numItems = this.state.columnItems[index].length - 1;

        if(newTransform > 0){
            newTransform = 0;
        }else if(newTransform < (-100 * numItems)){
            newTransform = newTransform + 100;
        }

        newTransforms[index] = newTransform;

        console.log(numItems);

        scroller.style.transform = "translateY(" + newTransform + "px)";
        
        this.setState({
            transform: newTransforms
        });

        event.preventDefault();
    }

    onItemClick(event){
        var id = event.target.id;
        var idNum = id.split("-")[2];
        var idType = id.split("-")[0].replace("Wrapper", "");
        var columnTitles = this.state.columnTitles;
        var controlID = this.state.controlWrapperID;

        var index = this.state.columnTitles.indexOf(idType);
        var newSelected = this.state.selected;
        newSelected[index] = idNum;

        var newSelectedItem = this.state.selectedItem;

        var count = 0;

        var titleToBeFound = "";

        for(count = 0; count < columnTitles.length; count++){
            if(id.includes(columnTitles[count])){
                titleToBeFound = columnTitles[count];
                break;
            }
        }
        
        if(idNum.localeCompare(this.state.selectedItem[index]) === 0){
            var itemWrapper = document.getElementById(titleToBeFound + "Wrapper-" + controlID + "-" + parseInt(idNum));
            itemWrapper.style.background = "radial-gradient(#111111, #000000)";
            idNum = "";
            newSelectedItem[index] = "";
        }else{
            if(this.state.selectedItem[index].localeCompare("") !== 0){
                var oldItemWrapper = document.getElementById(titleToBeFound + "Wrapper-" + controlID + "-" + this.state.selectedItem[index]);
                oldItemWrapper.style.background = "radial-gradient(#111111, #000000)";
            }
            var itemWrapper = document.getElementById(titleToBeFound + "Wrapper-" + controlID + "-" + parseInt(idNum));
            itemWrapper.style.background = "radial-gradient(#6b4e00, #000000)";
            newSelectedItem[index] = idNum;
        }

        this.setState({
            selectedItem: idNum,
            selected: newSelected,
            selectedItem: newSelectedItem
        });
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
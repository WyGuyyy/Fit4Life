import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import './CategoryView.css';
import Header from '../Header/Header';
import ExerciseTile from './ExerciseTile';
import Popout from '../Popout/Popout';
import AdminHeader from '../Admin/AdminHeader/AdminHeader';
import AdminPopout from '../Admin/AdminPopout/AdminPopout';
import ConfirmToast from '../Confirm/ConfirmToast';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { Link } from 'react-router-dom';
import {RedirectService} from '../_services/RedirectService';
import {baseURI} from '../_services/APIService';

class CategoryView extends React.Component{
    constructor(props){
        super(props);

        if(RedirectService.checkItemForUndefined(props.location.state)){
            this.state = {
                classroom: props.location.state.selectedClassroom,
                canGoBack: true,
            };
        }

        //window.addEventListener("resize", this.triggerRerender.bind(this));

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 

    }

    componentDidUpdate(){

    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    goBack(){ //This isnt working, start here next time
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }

    //Render the Header component to the DOM/Screen
    render(){

        if(!RedirectService.checkItemForUndefined(this.props.location.state)){
            return RedirectService.decideRedirect();
        }

        var classroom = this.props.location.state.selectedClassroom.title;
        //var component = this.props.location.state.selectedComponent.title;

        return(
            <Fragment>
                {localStorage.getItem("userRole").localeCompare("STUDENT") === 0 ?
                <Header title={"Exercises"} breadCrumbs={"Exercises for " + classroom} goBack={true} customClick={this.goBack.bind(this)}/> :
                <AdminHeader title="Preview" breadCrumbs={"Preview for class " + classroom} goBack={true} customClick={this.goBack.bind(this)}/>}
                <LoadingSpinner />
                <button className="Fit4Life-CategoryView" onClick={e => this.onGoToCategoryView(e)}><i className="fa fa-folder"/></button>
                <div className="componentContainer">
                    <Popout hist={this.props.history}/>
                    <AdminPopout hist={this.props.history}/>
                    <ConfirmToast text="Cannot access in Admin mode!"/>
                    <div className="componentWrapper" id="componentWrapper">
                        
                    </div>
                    <div className="Fit4Life-SearchbarWrapper">
                        <div className="Fit4Life-SearchElements-Wrapper">
                            <input className="Fit4Life-Searchbar"/>
                            <button className="Fit4Life-SearchButton" onClick={e => this.searchExercises(e)}>Search</button>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default CategoryView;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
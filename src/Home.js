import React, { Fragment } from 'react';
import './Home.css';
import Header from './Header/Header';
import Popout from './Popout/Popout'
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import {authService} from './_services/AuthenticationService';
import ClassroomService from './_services/ClassroomService';
// START HERE NEXT TIME, WORK ON REFACTORING COMPONENT HTML/JSX
class Home extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            canGoBack: false,
            studentClassrooms: [],
            visibleClassrooms: [],
            serachText: "",
            isLoading: false
        }

        this.classroomService = ClassroomService.getInstance();

    }
    
    /**
     * Check token and fill classroom upon mounting
     */
    componentDidMount(){ 
        authService.checkTokenValidity(this.props.history);
        this.fillClassrooms();
    }

    componentWillUnmount(){
        
    }

    /**
     * Fetch all classrooms for the currently signed in user
     */
    async fillClassrooms(){

        this.setState({
            isLoading: true
        });

        let classrooms = await this.classroomService.GetClassroomsForUser(localStorage.getItem("userID"));

        this.setState({
            studentClassrooms: classrooms,
            visibleClassrooms: classrooms,
            isLoading: false
         });
    }

    /**
     * Fetch all classrooms for a user based on a search string
     * @param {*} event the button click event for the search operation
     */
    async searchClassrooms(event){

        this.setState({
            isLoading: true
        });

        let classrooms = await this.classroomService.GetClassroomsForUser(localStorage.getItem("userID"));
        var searchText = this.state.searchText;

        for(var count = 0; count < classrooms.length; count++){
            if(!classrooms[count].title.toLowerCase().includes(searchText.toLowerCase())){
                classrooms.splice(count, 1);
                count = count - 1;
            }
        }

        this.setState({
            visibleClassrooms: classrooms,
            isLoading: false
        });
    }

    /**
     * Open the classroom selected by the user
     * @param {*} event click event of classroom item
     */
    goToComponent(event){
        var id = parseInt(event.target.value);
        var aClassroom = this.state.studentClassrooms.find(
            classroom => classroom.classroom_id === id
        );

        this.props.history.push({
            pathname: "/classroom",
            state: {selectedClassroom: aClassroom}
        });
    }

    /**
     * Return to previous component
     */
    goBack(){
        if(this.state.canGoBack){
            this.props.history.goBack();
        }
    }
    
    /**
     * Render the home page
     * @returns The Home page component
     */
    render(){

        return(
            <Fragment>
                <Header title="Home" breadCrumbs="Home" goBack={false} customClick={this.goBack.bind(this)}/>
                <LoadingSpinner isLoading={this.state.isLoading}/>
                <div className="homeContainer">
                    <Popout hist={this.props.history}/>
                    <div className="homeWrapper" id="homeWrapper">
                        <div className="Home-Button-Wrapper">
                            {
                                this.state.visibleClassrooms.map((classroom, index) =>
                                    <button className='homeButton' id={"Home-Button-" + index} 
                                        key={classroom.classroom_id} value={classroom.classroom_id} onClick={e => this.goToComponent(e)}>{classroom.title}</button>
                                )
                            }
                        </div>
                    </div>
                    <div className="Fit4Life-SearchbarWrapper">
                        <input className="Fit4Life-Searchbar" onChange={e => this.setState({searchText: e.target.value})}/>
                        <button className="Fit4Life-SearchButton" onClick={e => this.searchClassrooms(e)}>Search</button>
                    </div>
                </div>
            </Fragment>
        );
            
    }
}

export default Home;
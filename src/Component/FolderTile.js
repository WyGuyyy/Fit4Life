import React from 'react';
import './FolderTile.css';
import { Link } from 'react-router-dom';
import lhs_logo from '../Assets/lhs_logo.png';

class FolderTile extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            title: props.title
        };

    }
    
    //Lifecycle method for after Header component has mounted to the DOM
    componentDidMount(){ 
    
    }

    //Lifecycle event preparing Header component to unmount from DOM
    componentWillUnmount(){
        
    }

    //Render the Header component to the DOM/Screen
    render(){

        return(
            <div className="Folder-Tile-Container" onClick={this.props.tileClickEvent}>
                <div className="Folder-Tile-Wrapper">
                    <div className="Folder-Tile-Title-Wrapper">
                        <h2 className="Folder-Tile-Title">{this.state.title}</h2>
                    </div>
                </div>
            </div>
        );
            
    }s
}

export default FolderTile;

//<Hamburger />
//
//"react-router-dom": "^6.0.0-alpha.1",
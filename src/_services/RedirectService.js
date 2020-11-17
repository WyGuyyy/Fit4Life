import { Redirect } from "react-router-dom";
import React from 'react';

export const RedirectService = {
    checkItemForUndefined,
    decideRedirect
};

function checkItemForUndefined(item){
    return (item === undefined ? false : true);
}

function decideRedirect(){
    if(localStorage.getItem("userRole").localeCompare("STUDENT") === 0){
        return <Redirect to="/"/>
    }else{
        return <Redirect to="/admin"/>
    }
}
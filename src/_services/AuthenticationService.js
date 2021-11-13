import { AiOutlineLogout } from "react-icons/ai";
import {baseURI} from './APIService';

export const authService = {
    authenticate,
    logout,
    isLoggedIn,
    checkTokenValidity
};

async function authenticate(aUsername, aPassword){

    var response;
    var data;
    var user = {username: aUsername, password: aPassword};

    await fetch(baseURI + "/api/authenticate", {  
            method: "POST",
            body: JSON.stringify(user),                          
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                response = result;
            }
        ).catch(console.log);

    if(response.status){
        data = {success: "false", user: ""};
    }else{
        data = {success: "true", user: response};
    }

    return data;

}

async function checkTokenValidity(history){
    console.log(history);
    var token = localStorage.getItem('auth_token');
    var isExpired = false;
  
    await fetch(baseURI + "/api/user/" + localStorage.getItem("userID"), {  
          method: "GET",                          
          headers: {"Content-Type": "application/json",
                    "Authorization": "Bearer " + token}
      })
      .then(res => res.text())
      .then(
          (text) => {
              var result = text.length ? JSON.parse(text) : {};
              
              if(result.status === 401){
                isExpired = true;
              }
          }
      ).catch(console.log);
  
      if(isExpired){
        logout();
        history.push("/login");
      }
  
  }

function logout(){

    localStorage.setItem('logged_in', "false");
    localStorage.removeItem('auth_token');
    localStorage.removeItem('userID');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userDisplayName');
    localStorage.removeItem("userEmail");

}

function isLoggedIn(){
    return localStorage.getItem("logged_in");
}
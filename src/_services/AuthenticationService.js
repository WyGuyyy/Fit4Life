import { AiOutlineLogout } from "react-icons/ai";

export const authService = {
    authenticate,
    logout,
    isLoggedIn
};

async function authenticate(aUsername, aPassword){

    var response;
    var data;
    var user = {username: aUsername, password: aPassword};

    await fetch("/api/authenticate", {  
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
import { AiOutlineLogout } from "react-icons/ai";

export const authService = {
    authenticate,
    logout
};

async function authenticate(aUsername, aPassword){

    var response;
    var user = {username: aUsername, password: aPassword};

    await fetch("http://localhost:8080/api/authenticate", {  
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

    if(!(response.userID === undefined && response.userID === null)){
    
        localStorage.setItem('userID', response.userID);
        localStorage.setItem('userRole', response.userRole);
        localStorage.setItem('userDisplayName', response.displayName);
        localStorage.setItem('logged_in', true);
        localStorage.setItem('auth_token', response.token);

    }else{
        localStorage.setItem("logged_in", false);
    }

}

function logout(){
    localStorage.removeItem('user');
    localStorage.setItem('logged_in', false);
    localStorage.removeItem('auth_token');
}
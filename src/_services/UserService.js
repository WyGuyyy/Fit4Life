import { AiOutlineLogout } from "react-icons/ai";
import {baseURI} from './APIService';

const getUserFirstLast = async () => {

    var response;
    var data;

    await fetch(baseURI + "/api/user/" + localStorage.getItem("userID"), {  
            method: "GET",                        
            headers: {"Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                response = result;
                data = {first: response.first_name, last: response.last_name};
            }
        ).catch(console.log);

    return data;

}

export async function getUserFullName(){

    return await getUserFirstLast();

}

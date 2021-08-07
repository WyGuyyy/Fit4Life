import {baseURI} from './APIService';

const getGradesForWeek = async (userID, classroomID, startDate, endDate) => {

    var response;

    await fetch(baseURI + "/api/grade/forWeek/" + userID + "/" + classroomID + "/" + startDate + "/" + endDate, {  
            method: "GET",                        
            headers: {"Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                response = result;
            }
        ).catch(console.log);

    return response;

}

export async function getStudentGradesForWeek(userID, classroomID, startDate, endDate){
    
    return await getGradesForWeek(userID, classroomID, startDate, endDate);

}
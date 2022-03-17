import {baseURI} from './APIService';

export default class ClassroomService {
    static classroomService = null;

    static getInstance() {
        if(ClassroomService.myInstance == null) {
            ClassroomService.classroomService = new ClassroomService();
        }
        return ClassroomService.classroomService;
    }

    async GetClassroomsForUser(userID) {

        return fetch(baseURI + "/api/classroom/foruser/" + userID, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                return result;
            }
        ).catch(console.log);

    }
}
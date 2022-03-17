import {baseURI} from './APIService';

/**
 * Service for interacting with the Classroom API. This Service implements a singleton pattern,
 * so only one instance will be available to the entire application.
 */
export default class ClassroomService {
    
    static classroomService = null;

    /**
     * Return the singleton ClassroomService instance
     * @returns singleton ClassroomService
     */
    static getInstance() {
        if(ClassroomService.myInstance == null) {
            ClassroomService.classroomService = new ClassroomService();
        }
        return ClassroomService.classroomService;
    }

    /**
     * Retrieves all classrooms for a user
     * @param {*} userID ID of the user to filter classrooms for
     * @returns list of classrooms belonging to a user
     */
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

    /**
     * Retrieves all classrooms for a user filtered on a search string
     * @param {*} userID ID of the user to filter classrooms for
     * @param {*} search search string used to filter a users classrooms
     * @returns list of classrooms belonging to a user and satisfying the search filter
     */
     async SearchClassroomsForUser(userID, searchText) {

        return fetch(baseURI + "/api/classroom/foruser/" + userID, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                result = result.filter(classroom => 
                    classroom.title
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
                );
                return result;
            }
        ).catch(console.log);

    }
}
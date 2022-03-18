import {baseURI} from './APIService';
import BuilderService from './BuilderService';

export default class ExerciseService {

    static exerciseService = null;

    constructor() {
        this.builderService = BuilderService.getInstance();
    }

    /**
     * Return the singleton ExerciseService instance
     * @returns singleton ExerciseService
     */
    static getInstance() {
        if (ExerciseService.exerciseService === null) {
            ExerciseService.exerciseService = new ExerciseService();
        }
        return ExerciseService.exerciseService;
    }

    async GetExercisesWithinDateRange(classroomID, date) {
        return fetch(baseURI + "/api/exercise/forDateRange/" + classroomID + "/" + date + "/" + date, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                return result.map(exercise => 
                    this.builderService.BuildExercise(exercise)
                );
            }
        ).catch(console.log);
    }

    async GetActivatedExercisesForClassroom(classroomID) {
        return fetch(baseURI + "/api/exercise/byclassroom/activated/" + classroomID, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                return result.map(exercise => 
                    this.builderService.BuildExercise(exercise)
                );
            }
        ).catch(console.log);
    }
}
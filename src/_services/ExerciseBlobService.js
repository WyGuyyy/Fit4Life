import { baseURI } from "./APIService";
import BuilderService from "./BuilderService";

export default class ExerciseBlobService {

    static exerciseBlobService = null;

    constructor() {
        this.builderService = BuilderService.getInstance();
    }

    static getInstance() {
        if (ExerciseBlobService.exerciseBlobService === null) {
            ExerciseBlobService.exerciseBlobService = new ExerciseBlobService();
        }
        return ExerciseBlobService.exerciseBlobService;
    }

    async GetExerciseBlobsForClass(classroomID) {
        return fetch(baseURI + "/api/exercise_blob/foraclass/" + classroomID, {  
            method: "GET",                          
            headers: {"Content-Type": "application/json",
                      "Authorization": "Bearer " + localStorage.getItem("auth_token")}
        })
        .then(res => res.text())
        .then(
            (text) => {
                var result = text.length ? JSON.parse(text) : {};
                console.log(result);
                return result.map(blob => 
                    this.builderService.BuildExercisBlob(blob)    
                );
            }
        ).catch(console.log);
    }
}
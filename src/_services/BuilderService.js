import Classroom from "../Models/Classroom";
import Exercise from "../Models/Exercise";
import ExerciseBlob from "../Models/ExerciseBlob";
import ExerciseImageMap from "../Models/ExerciseImageMap";

export default class BuilderService {
    
    static builderService = null;

    static getInstance() {
        if (BuilderService.builderService === null) {
            BuilderService.builderService = new BuilderService();
        }
        return BuilderService.builderService;
    }

    /**
     * Build new Exercise instance from provided data
     * @param {*} exercise data for new Exercise
     * @returns a new Exercise instance
     */
     BuildExercise(exercise) {
        return new Exercise(
            exercise.exercise_id,
            exercise.title,
            exercise.activated,
            exercise.classroom
        );
    }

    /**
     * Build a Classroom instance from provided data
     * @param {*} classroom data for new Classroom
     * @returns a new Classroom instance
     */
     BuildClassroom(classroom) {
        return new Classroom(
            classroom.classroom_id,
            classroom.title,
            classroom.teacher
        );
    }

    /**
     * Build new ExerciseBlob instance from provided data
     * @param {*} exercise data for new ExerciseBlob
     * @returns a new ExerciseBlob instance
     */
     BuildExercisBlob(blob) {
        return new ExerciseBlob(
            blob.exercise_blob_id,
            blob.exercise_id,
            blob.classroom_id,
            blob.blob_data,
            blob.content_type,
            blob.filename
        );
    }

    /**
     * Build new ExerciseImageMap instance from provided data
     * @param {*} exercises exercise data for ExerciseImageMap
     * @param {*} images image data for ExerciseImageMap
     * @returns a new ExerciseImageMap instance
     */
    BuildExerciseImageMap(exercises, images) {
        return exercises.map(exercise => 
            new ExerciseImageMap(
                exercise,
                images.find(image =>
                    image.exerciseID === exercise.exerciseID    
                )
            )    
        );
    }

}
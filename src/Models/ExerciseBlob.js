export default class ExerciseBlob {
    constructor(blobID, exerciseID, classroomID, data, contentType, fileName) {
        this.blobID = blobID;
        this.exerciseID = exerciseID;
        this.classroomID = classroomID;
        this.data = data;
        this.contentType = contentType;
        this.fileName = fileName;
    }
}
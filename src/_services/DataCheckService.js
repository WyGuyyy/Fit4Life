export const DataCheckService = {
    validateFields
};

function validateFields(fieldBundle){

    var count;

    for(count = 0; count < fieldBundle.length; count++){

        if(fieldBundle[count].trim().localeCompare("") === 0 || fieldBundle[count] === undefined || fieldBundle[count] === null){
            return false;
        }

    }

    return true;

}
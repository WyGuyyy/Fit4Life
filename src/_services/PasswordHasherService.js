import { sha256 } from 'js-sha256';

export const passHashService = {
    hashPassword
};

function hashPassword(rawPassword){

    var hashedPassword;

    hashedPassword = sha256(rawPassword);

    return hashedPassword;

}

import * as bcrypt from "bcryptjs";


export function hashPassword(password: string) {
    return bcrypt.hashSync(password, 8);
}

export function checkIfUnencryptedPasswordIsValid(unencryptedPassword: string, encriptedPassword: string) {
    console.log(`checkIfUnencryptedPasswordIsValid(unencryptedPassword: ${unencryptedPassword}, encriptedPassword: ${encriptedPassword}) {`)
    return bcrypt.compareSync(unencryptedPassword, encriptedPassword);
}
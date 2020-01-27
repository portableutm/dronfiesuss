import {User, Role} from "../entities/User";
import { hashPassword } from "../services/encrypter";


let nums = [1,2,3,4,5,6,7,8,9] 
export const Users = nums.map(num => `User_${num}`).map((username, idx) => {
    let user : User = {
        username : username,
        email : `${username}@dronfies.com`,
        firstName : `name_${username}`,
        lastName : `last_${username}`,
        password : hashPassword(`${username}`),
        role : idx % 2 === 0 ? Role.ADMIN : Role.PILOT
    }
    return user
})



import { User, Role } from "../entities/User";
import { hashPassword } from "../services/encrypter";


// let nums = [1,2,3,4,5,6,7,8,9] 
// export let Users = nums.map(num => `User_${num}`).map((username, idx) => {
//     let user : User = {
//         username : username,
//         email : `${username}@dronfies.com`,
//         firstName : `name_${username}`,
//         lastName : `last_${username}`,
//         password : hashPassword(`${username}`),
//         role : idx % 2 === 0 ? Role.ADMIN : Role.PILOT
//     }
//     return user
// })

// let user : User = {
//     username : "admin",
//     email : `admin@dronfies.com`,
//     firstName : `Admin`,
//     lastName : `Admin`,
//     password : hashPassword(`admin`),
//     role : Role.ADMIN
// }

// Users.push(user)



export let Users = [
    {
        username: "admin",
        email: `admin@dronfies.com`,
        firstName: `Admin`,
        lastName: `Admin`,
        password: hashPassword(`admin`),
        role: Role.ADMIN
    },
    {
        email: `renate@dronfies.com`,
        "firstName": "Renate",
        "lastName": "Penvarden",
        "password": "xD6lJ9ATuA",
        "username": "RenatePenvarden",
        "role": Role.PILOT
    }, {
        email: `maurine@dronfies.com`,
        "firstName": "Maurine",
        "lastName": "Fowlie",
        "password": "eGWQtF",
        "username": "MaurineFowlie",
        "role": Role.PILOT
    }, {
        email: `jiditha@dronfies.com`,
        "firstName": "Juditha",
        "lastName": "Strut",
        "password": "XvwUDyUKc",
        "username": "JudithaStrut",
        "role": Role.PILOT
    }, {
        email: `monro@dronfies.com`,
        "firstName": "Monro",
        "lastName": "Bhatia",
        "password": "OnLzzH6Hf",
        "username": "MonroBhatia",
        "role": Role.PILOT
    }, {
        email: `jeffie@dronfies.com`,
        "firstName": "Jeffie",
        "lastName": "Boddice",
        "password": "DInE6O",
        "username": "JeffieBoddice",
        "role": Role.PILOT
    }, {
        email: `trula@dronfies.com`,
        "firstName": "Trula",
        "lastName": "Remon",
        "password": "vqpZSu",
        "username": "TrulaRemon",
        "role": Role.PILOT
    }, {
        email: `jacquenette@dronfies.com`,
        "firstName": "Jacquenette",
        "lastName": "Witcherley",
        "password": "4O5ZtfWoD",
        "username": "JacquenetteWitcherley",
        "role": Role.PILOT
    }, {
        email: `bettye@dronfies.com`,
        "firstName": "Bettye",
        "lastName": "Stopford",
        "password": "lY8csYMID",
        "username": "BettyeStopford",
        "role": Role.PILOT
    }, {
        email: `mair@dronfies.com`,
        "firstName": "Mair",
        "lastName": "Giurio",
        "password": "xlr3T40",
        "username": "MairGiurio",
        "role": Role.PILOT
    }, {
        email: `gay@dronfies.com`,
        "firstName": "Gay",
        "lastName": "Oxtarby",
        "password": "wgHcqd",
        "username": "GayOxtarby",
        "role": Role.PILOT
    }
]

export function getUserListAsMap(Users){
    let UsersObj = {}
    for (let index = 0; index < Users.length; index++) {
        const user = Users[index];
        UsersObj[user.username] = user
    }
    return UsersObj;
}





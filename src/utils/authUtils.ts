

import { User } from "../entities/User";

export function getUserFields(user:User){
    return {
        username: user.username,
        email: user.email,
        role: user.role
    }
}
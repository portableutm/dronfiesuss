

import { User } from "../entities/User";

// getUserFields for payload
export function getUserFields(user:User){
    return {
        username: user.username,
        email: user.email,
        role: user.role
    }
}

export function getPayloadFromResponse(response:any){
    return response.locals.jwtPayload
}
import { NextFunction, Request, Response } from "express";
import { User, Role } from "../entities/User";
import { UserDao } from "../daos/UserDaos";
import { hashPassword } from "../services/encrypter";
import { sendMail } from "../services/mailService";
import { getPayloadFromResponse } from "../utils/authUtils";
import { genericTextLenghtValidation } from "../utils/validationUtils";
import { buildConfirmationLink, buildConfirmationHtmlMail, buildConfirmationTextMail } from "../utils/mailContentUtil";
import { UserStatus, Status } from "../entities/UserStatus";
import { UserStatusDao } from "../daos/UserStatusDao";
import { frontEndUrl } from "../config/config";
import { multipleFiles } from "../services/uploadFileService";


export class UserController {

    private dao = new UserDao()
    private userStatusDao = new UserStatusDao()


    /**
     * Get all usesrs, only admin can use it.
     * @param request 
     * @param response 
     * @param next 
     */
    async all(request: Request, response: Response, next: NextFunction) {
        let { role } = getPayloadFromResponse(response)
        if (role == Role.ADMIN) {
            return response.json(await this.dao.all());
        }
        else {
            return response.sendStatus(401)
        }
    }

    /**
     * Get a user. Admin can get all data, other user only get the owndata
     * @param request 
     * @param response 
     * @param next 
     */
    async one(request: Request, response: Response, next: NextFunction) {
        let { role, username } = getPayloadFromResponse(response)
        if ((role == Role.ADMIN) || (username == request.params.id)) {
            try {
                return response.json(await this.dao.one(request.params.id));
            } catch (error) {
                return response.sendStatus(404)
            }
        }
        else {
            return response.sendStatus(401)
        }
    }

    /**
     * Create a new user pass by a POST request
     * @example {
     *          username: "AnOtherUserToInsert",
     *          email: `anotherusertoinsert@dronfies.com`,
     *          firstName: `Any`,
     *          lastName: `Name`,
     *          password: `password`,
     *          role: Role.PILOT
     *      }
     * @param request 
     * @param response 
     * @param next 
     */
    async save(request: Request, response: Response, next: NextFunction) {
        let { role } = getPayloadFromResponse(response)
        try {
            if (role == Role.ADMIN) {
                let user: User = request.body
                let status: UserStatus = request.body.status
                if (status == undefined) {
                    status = new UserStatus()
                    status.status = Status.UNCONFIRMED
                    status.token = generateToken();
                    user.status = status
                }
                // trimFields(user)
                let errors = validateUser(user)
                if (errors.length == 0) {
                    let s = await this.userStatusDao.save(status)
                    user.password = hashPassword(user.password)
                    let insertedDetails = await this.dao.save(user)
                    return response.json(user);
                } else {
                    response.status(400)
                    return response.json(errors)
                }
            }
            else {
                return response.sendStatus(401)
            }
        } catch (error) {
            response.status(400)
            return response.json({ "Error": "Insert fail" })
        }
    }

    /**
     * Updates an User, in a PUT method, or creates it, given the username is valid
     * Only admins can update an user, unless it's an user updating their own information.
     * @example {
     *          username: "AnOtherUserToInsert",
     *          email: `anotherusertoinsert@dronfies.com`,
     *          firstName: `Any`,
     *          lastName: `Name`,
     *          password: `password`,
     *          role: Role.PILOT
     *      }
     * @param request 
     * @param response 
     * @param next 
     */
    async updateUser(request, response: Response, next: NextFunction) {
        let { role, username } = getPayloadFromResponse(response)
        let dao = this.dao

        let upload = multipleFiles([
            { name: 'document_file', maxCount: 1 },
            { name: 'permit_front_file', maxCount: 1 },
            { name: 'permit_back_file', maxCount: 1 },
        ]);
        upload(request, response, async function (err) {
            // console.log(`BODy>>>>:${JSON.stringify(request.body)}`)
            try {
                // console.log(`Entro por aqui...${username} == ${request.params.id}`)
                if (role == Role.ADMIN || (username == request.params.id)) {
                    let user: User = request.body
                    user.username = request.params.id
                    // console.log(`Llmando a dinacia fields`)
                    diancia_fields(request, user)

                    // console.log(`USER>>>>:${JSON.stringify(request.body)}`)

                    let errors = [] //validateUser(user)
                    if (errors.length == 0) {
                        //user.password = hashPassword(user.password)
                        let user_viejo = await dao.one(username)
                        let toUpdate = Object.assign({}, user_viejo, user)
                        let insertedDetails = await dao.update(toUpdate)
                        let user_nuevo = await dao.one(username)
                        return response.json(user_nuevo);
                    } else {
                        response.status(400)
                        return response.json(errors)
                    }
                }
                else {
                    return response.sendStatus(401)
                }
            } catch (error) {
                console.error(`El error: ${JSON.stringify(error)}`)
                response.status(400)
                return response.json({ "Error": error })
            }
        })

    }

    /**
     * Updates an User's password
     * @example {
     *          username: "AnOtherUserToInsert",
     *          email: `anotherusertoinsert@dronfies.com`,
     *          firstName: `Any`,
     *          lastName: `Name`,
     *          password: `password`,
     *          role: Role.PILOT
     *      }
     * @param request 
     * @param response 
     * @param next 
     */
    async updateUserPassword(request: Request, response: Response, next: NextFunction) {
        let { role, username } = getPayloadFromResponse(response)
        try {
            if (role == Role.ADMIN || (username == request.params.id)) {
                let user: User = request.body
                // trimFields(user)
                let errors = validateUser(user)
                if (errors.length == 0) {
                    user.username = request.params.id
                    user.password = hashPassword(user.password)
                    let insertedDetails = await this.dao.update(user)
                    return response.json(user);
                } else {
                    response.status(400)
                    return response.json(errors)
                }
            }
            else {
                return response.sendStatus(401)
            }
        } catch (error) {
            response.status(400)
            return response.json({ "Error": "Insert fail" })
        }
    }



    /**
     * Create a new user PILOT with status UNCONFIRMED pass by a POST request 
     * and send a confirmation mail
     * @example {
     *          username: "AnOtherUserToInsert",
     *          email: `anotherusertoinsert@dronfies.com`,
     *          firstName: `Any`,
     *          lastName: `Name`,
     *          password: `password`,
     *          role: Role.PILOT
     *      }
     * @param request 
     * @param response 
     * @param next 
     */
    async userRegister(request, response: Response, next: NextFunction) {

        let dao = this.dao
        let userStatusDao = this.userStatusDao

        try {

            // let user: User //= request.body
            let upload = multipleFiles([
                { name: 'document_file', maxCount: 1 },
                { name: 'permit_front_file', maxCount: 1 },
                { name: 'permit_back_file', maxCount: 1 },
            ]);
            upload(request, response, async function (err) {
                try {
                    if (err) {
                        console.error(err)
                    } else {
                    }

                    // console.log(`Body::${JSON.stringify(request.body)}`)
                    // console.log(`-files-::${JSON.stringify(request.files)}`)
                    let user: User = {
                        "username": request.body.username,
                        "email": request.body.email,
                        "firstName": request.body.firstName,
                        "lastName": request.body.lastName,
                        "password": request.body.password,
                        "role": Role.PILOT
                    }

                    const origin = request.headers.origin

                    // console.log(`Dinacia user req: ${request.body.dinacia_user_str}`)
                    let dinaciaUser = JSON.parse(request.body.dinacia_user_str || "{}")
                    // console.log(`Dinacia user: ${request.body.dinacia_user_str}`)

                    delete request.body.dinacia_user_str

                    user.dinacia_user = dinaciaUser
                    if (request.files) {
                        if (request.files.document_file) {
                            console.log(`Assign document_file_path`)
                            user.dinacia_user.document_file_path = request.files.document_file[0].path
                        }
                        if (request.files.permit_front_file) {
                            console.log(`Assign permit_front_file`)
                            user.dinacia_user.permit_front_file_path = request.files.permit_front_file[0].path
                        }
                        if (request.files.permit_back_file) {
                            console.log(`Assign permit_back_file`)
                            user.dinacia_user.permit_back_file_path = request.files.permit_back_file[0].path
                        }
                    }

                    let status = new UserStatus()
                    status.status = Status.UNCONFIRMED
                    status.token = generateToken();

                    user.status = status

                    console.log("Register request", request.headers.origin);

                    let errors = validateUser(user)
                    if (errors.length == 0) {
                        //TODO do transaction with this two saves
                        let s = await userStatusDao.save(status)
                        user.password = hashPassword(user.password)

                        // console.log(`User to insert:${JSON.stringify(user, null, 2)}`)
                        let insertedDetails = await dao.save(user)
                        console.log(`INERTED DETAILS::${JSON.stringify(insertedDetails, null, 2)}`)
                        sendMailToConfirm(user, status, origin)

                        return response.json(user);
                    } else {
                        response.status(400)
                        return response.json(errors)
                    }
                } catch (error) {
                    console.error("Register error" + JSON.stringify(error))
                    response.status(400)
                    return response.json({ "Error": error })
                }


            })

        } catch (error) {
            console.log("Register error", error)
            response.status(400)
            return response.json({ "Error": "Insert fail" })
        }
    }

    /**
     * Change the status of user with username passed and status.token 
     * @example {
     *  username: "unconfirmedTestUser",
     *  token: status.token
     * }
     * @param request 
     * @param response 
     * @param next 
     */
    async confirmUser(request: Request, response: Response, next: NextFunction) {
        try {

            // console.log(`confirm user: ${JSON.stringify(request.body)}`)

            let token = request.body.token
            let user = await this.dao.one(request.body.username)

            let status = await user.status;
            // console.log(`Estado que obtengo de bbdd ${JSON.stringify(status, null, 2)}`)
            if (token == status.token) { //FIXME add status unconfirmed check
                try {
                    status.status = Status.CONFIRMED
                    // console.log(`Estado antes de pasar al save ${JSON.stringify(status, null, 2)}`)
                    let info = await this.userStatusDao.save(status)
                    // console.log(`Info del save ${JSON.stringify(info, null, 2)}`)
                    // console.log(`Estado antes de pasar al save ${JSON.stringify(status, null, 2)}`)
                    return response.json({ message: "Confirmed user" });
                } catch (error) {
                    // response.statusCode = 400
                    // return response.json({error:"Invalid token"})
                    return response.sendStatus(404)

                }
            } else {
                console.log(`${token} == ${status.token}`)
                response.statusCode = 401
                return response.json({ error: "Invalid link" })
            }
        } catch (error) {
            return response.sendStatus(404)
        }

    }

    // async remove(request: Request, response: Response, next: NextFunction) {
    //     // let userToRemove = await this.dao.one(request.params.id);
    //     await this.dao.remove(request.params.username);
    // }

}

function validateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return true
    }
    return false
}

// function trimFields(user:User){
//     // user.email = user.email.trim
//     user.firstName = user.firstName.trim()
//     user.lastName = user.lastName.trim()
//     user.username = user.username.trim()

// }

function validateUser(user: User) {
    // console.log("Validando usuarios")
    // console.log(user)
    let errors = []
    if (!validateEmail(user.email)) {
        errors.push("Invalid email")
    }
    if (!genericTextLenghtValidation(user.firstName)) {
        errors.push("Invalid first name")
    }
    if (!genericTextLenghtValidation(user.lastName)) {
        errors.push("Invalid last name")
    }
    if (!genericTextLenghtValidation(user.password)) {
        errors.push("Invalid password")
    }
    if (!genericTextLenghtValidation(user.username)) {
        errors.push("Invalid username")
    }
    return errors
    // return true
}

function generateToken(): String {
    let d = new Date();
    return hashPassword(d.toUTCString())
}

function sendMailToConfirm(user: User, status: UserStatus, url) {
    let confirmSubjcet = `${user.firstName}, please confirm your new PortableUTM user`
    let link = buildConfirmationLink(user.username, status.token, url)
    let textContent = buildConfirmationTextMail(user.username, link)
    let htmlContent = buildConfirmationHtmlMail(user.username, link)

    sendMail([user.email], confirmSubjcet, textContent, htmlContent)
}

function diancia_fields(request, user) {
    try {
        let dinaciaUser = JSON.parse(request.body.dinacia_user_str || "{}")
        delete user.dinacia_user_str
        user.dinacia_user = dinaciaUser
        // console.log(`Dinacia user: ${request.body.dinacia_user_str}`)


        if (request.files) {
            if (request.files.document_file) {
                console.log(`Assign document_file_path`)
                user.dinacia_user.document_file_path = request.files.document_file[0].path
            }
            if (request.files.permit_front_file) {
                console.log(`Assign permit_front_file`)
                user.dinacia_user.permit_front_file_path = request.files.permit_front_file[0].path
            }
            if (request.files.permit_back_file) {
                console.log(`Assign permit_back_file`)
                user.dinacia_user.permit_back_file_path = request.files.permit_back_file[0].path
            }
        }
    } catch (error) {
        console.error(error)
    }

}
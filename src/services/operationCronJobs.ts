import { OperationDao } from "../daos/OperationDaos";
import { Operation, OperationState } from "../entities/Operation";
import { getNow } from "./dateTimeService";
import { OperationVolume } from "../entities/OperationVolume";
import { UASVolumeReservationDao } from "../daos/UASVolumeReservationDao";
import { RestrictedFlightVolumeDao } from "../daos/RestrictedFlightVolumeDao";
import { sendOpertationStateChange } from "./asyncBrowserComunication";
import { adminEmail, isDinacia } from "../config/config";
import { logInfo, logError } from "../services/logger";



// import { OperationIntersections } from "../entities/OperationIntersection";
import { Role } from "../entities/User";


import { doSendMailForPendingOperation, doSendMailForNotAcceptedOperation } from "../restControllers/MailController"
import { operationMailHtml } from "../utils/mailContentUtil";
import { sendMail } from "./mailService";

let operationDao: OperationDao;
let uvrDao: UASVolumeReservationDao;
let rfvDao: RestrictedFlightVolumeDao;

const MAX_ALTITUDE = 120

export async function processOperations() {
    operationDao = new OperationDao()
    uvrDao = new UASVolumeReservationDao()
    rfvDao = new RestrictedFlightVolumeDao()
    // let op : Operation

    let operations = await operationDao.getOperationsForCron()
    for (let index = 0; index < operations.length; index++) {
        const operation: Operation = operations[index];
        // console.log(`Operation: ${operation.gufi}, ${operation.state}`)

        try {


            // try {
            switch (operation.state) {
                case OperationState.PROPOSED:
                    processProposed(operation)
                    break;
                // case OperationState.NOT_ACCEPTED:
                //     processNotAccepted(operation)
                //     break;
                case OperationState.ACCEPTED:
                    processAccepted(operation)
                    break;
                case OperationState.ACTIVATED:
                    processActivated(operation)
                    break;
                // case OperationState.NONCONFORMING:
                //     processNonconforming(operation)
                //     break;
                case OperationState.ROGUE:
                    processRouge(operation)
                    break;
                case OperationState.PENDING:
                    processPending(operation)
                    break;
                default:
                    break;
            }
        } catch (error) {
            errorOnOperation(operation, "processOperations: " + JSON.stringify(error))
        }
        // } catch (error) {
        //     console.error(`Error when processing operation: ${operation.gufi}\n${error}`)
        // }
        // console.log("******* ******* ******* ******* ******* ******* ******* ")
    }
}


/**
 * If a operation is proposed we need to check ir intersects with an other operation volume or uvr
 * @param operation 
 */
async function processProposed(operation: Operation) {
    try {

        for (let index = 0; index < operation.operation_volumes.length; index++) {
            const operationVolume = operation.operation_volumes[index];

            let intersect = await checkIntersection(operation, operationVolume)
            if (intersect && operation.flight_comments) {
                // console.log(`------------------------------>>>`)
                let result = await operationDao.save(operation)
            }

            // console.log(`-=-=-=-=-\n${operation.name} ${JSON.stringify(operation.owner)}`)
            if (intersect) {
                doSendMailForNotAcceptedOperation(operationDao,
                    { receiverMail: operation.owner ? operation.owner.email : adminEmail, gufi: operation.gufi, bodyMail: "Email generado automaticamente" },
                    { role: Role.ADMIN, username: "" })
                return changeState(operation, OperationState.NOT_ACCEPTED)
            } else {
                let changeToPending = false
                let reason = ""
                if (await intersectsWithRestrictedFlightVolume(operation, operationVolume)) {
                    changeToPending = true
                    reason = `Intersect with a RFV. ${reason}`
                }
                if (isDinacia && operation.operation_volumes.reduce((prev, currentVolume) => { return prev && currentVolume.max_altitude > MAX_ALTITUDE }, true)) {
                    changeToPending = true
                    reason = `The maximun altitude is over ${MAX_ALTITUDE}. ${reason}`
                }
                // --------------------------------------------------gt

                // let op: Operation = new Operation();
                //  op.owner.email
                // console.log(`********\n${JSON.stringify(operation, null, 2)}\n********`)

                if (changeToPending) {
                    operation.flight_comments = `${reason}\n${operation.flight_comments}`
                    let result = await operationDao.save(operation)
                    operationDao = new OperationDao()
                    let error = await doSendMailForPendingOperation(
                        operationDao,
                        { receiverMail: operation.owner ? operation.owner.email : adminEmail, gufi: operation.gufi, bodyMail: "Email generado automaticamente" },
                        { role: Role.ADMIN, username: "" })
                    return changeState(operation, OperationState.PENDING)
                }
            }

        }

        // console.log(`(${date.toISOString()} >= ${dateBegin.toISOString()}) && (${date.toISOString()} < ${dateEnd.toISOString()})`)
        let changeToActived = false;
        let currentDate = getNow()
        for (let index = 0; index < operation.operation_volumes.length; index++) {
            const operationVolume = operation.operation_volumes[index];
            let dateBegin = new Date(operationVolume.effective_time_begin)
            let dateEnd = new Date(operationVolume.effective_time_end)
            if ((currentDate.getTime() >= dateBegin.getTime()) && (currentDate.getTime() < dateEnd.getTime())) {
                changeToActived = true // changeState(operation, OperationState.ACTIVATED)
            }
        }
        if (changeToActived) {
            changeState(operation, OperationState.ACTIVATED)
        } else {
            changeState(operation, OperationState.ACCEPTED)
        }
    } catch (error) {
        // console.log(`Error::${JSON.stringify(error)}`)
        // console.log(`Error::${JSON.stringify(operation)}`)
        errorOnOperation(operation, JSON.stringify(error))
    }
}

async function checkIntersection(operation: Operation, operationVolume: OperationVolume) {
    try {
        let operationsCount = await operationDao.countOperationVolumeByVolumeCountExcludingOneOperation(operation.gufi, operationVolume)
        let uvrCount = await uvrDao.countUvrIntersections(operationVolume)
        let msg = ((operationsCount > 0) ? "ANOTHER_OPERATION" : "") + ((uvrCount > 0) ? "UVR" : "")
        operation.flight_comments = msg

        return (operationsCount > 0) || (uvrCount > 0)
    } catch (e) {
        console.log(e)
        return true //TODO throw exception
    }
}

async function intersectsWithRestrictedFlightVolume(operation: Operation, operationVolume: OperationVolume) {
    // let rfvCount = await rfvDao.countRfvIntersections(operationVolume)
    // // if(rfvCount > 0) console.log(`****>>${rfvCount}::${operation.gufi}->${JSON.stringify(operationVolume.operation_geography)}`)
    // return (rfvCount > 0);
    let rfvs = await rfvDao.getRfvIntersections(operationVolume)
    return (rfvs.length > 0);
}

async function isExpiredDinaciaUserPermitExpireDateWhenFly(operation: Operation) {
    // let userDao = new UserDao()
    // userDao.one(operation.owner.username)

    // let permit_expire_date = operation.owner.dinacia_user.permit_expire_date
    let isExpiredWhenFly = false
    if (operation.owner.dinacia_user && operation.owner.dinacia_user.permit_expire_date) {
        let permit_expire_date = new Date(operation.owner.dinacia_user.permit_expire_date)

        if (permit_expire_date != undefined) {
            for (let index = 0; index < operation.operation_volumes.length; index++) {
                const element = operation.operation_volumes[index];
                let effective_time_end_date = new Date(element.effective_time_end)

                isExpiredWhenFly = isExpiredWhenFly || (effective_time_end_date.getTime() > permit_expire_date.getTime())
            }
        }
    } else {
        isExpiredWhenFly = true
    }

    // console.log(`checkDinaciaUserPermitExpireDate::isExpiredWhenFly=${isExpiredWhenFly}`)
    return isExpiredWhenFly
}

// async function populateIntersections(operation: Operation, operationVolume: OperationVolume) {

//     let operation_inserctions = new OperationIntersections // {operations:[], uvrs:[], rfvs:[]} 

//     let operations = await operationDao.getOperationVolumeByVolumeCountExcludingOneOperation(operation.gufi, operationVolume)
//     let operationsCount = await operationDao.countOperationVolumeByVolumeCountExcludingOneOperation(operation.gufi, operationVolume)
//     operation_inserctions.operations = operations

//     let uvrs = await uvrDao.getUvrIntersections(operationVolume)
//     let uvrsCount = await uvrDao.countUvrIntersections(operationVolume)
//     operation_inserctions.uvrs = uvrs

//     let rfvs = await rfvDao.getRfvIntersections(operationVolume)
//     let rfvsCount = await rfvDao.countRfvIntersections(operationVolume)
//     operation_inserctions.rfvs = rfvs

//     operation.operation_inserctions = operation_inserctions

//     console.log(` -  -  -  -  -  -  ->Obj!${JSON.stringify(operation_inserctions, null, 2)}`)
//     console.log(` -  -  -  -  -  -  ->OP!${operation.name}!!${JSON.stringify(operation.operation_inserctions, null, 2)}`)
//     operation.name = operation.name + " *** "
//     console.log(` -  -  -  -  -  -  ->Ops:${operationsCount}:${JSON.stringify(operations)}`)
//     console.log(` -  -  -  -  -  -  ->Uvrs:${uvrsCount}:${JSON.stringify(uvrs)}`)
//     console.log(` -  -  -  -  -  -  ->Rfvs:${rfvsCount}:${JSON.stringify(rfvs)}`)
//     await operationDao.save(operation)
//     console.log(` -  -  -  -  -  -  ->OP!${operation.name}!!${JSON.stringify(operation.operation_inserctions, null, 2)}`)

//     // return (rfvs.length > 0);
// }



/**
 * We will delete this, is like close
 * @param operation 
 */
function processNotAccepted(operation: Operation) {
}

/**
 * If poperation is accepted and it's time to start operation change state to activated
 * @param operation 
 */
function processAccepted(operation: Operation) {
    try {
        let date = getNow()
        for (let index = 0; index < operation.operation_volumes.length; index++) {
            const operationVolume = operation.operation_volumes[index];
            let dateBegin = new Date(operationVolume.effective_time_begin)
            let dateEnd = new Date(operationVolume.effective_time_end)
            // console.log(`(${date.toISOString()} >= ${dateBegin.toISOString()}) && (${date.toISOString()} < ${dateEnd.toISOString()})`)
            if ((date.getTime() >= dateBegin.getTime()) && (date.getTime() < dateEnd.getTime())) {
                changeState(operation, OperationState.ACTIVATED)
            }
            if ((date.getTime() > dateEnd.getTime())) {
                changeState(operation, OperationState.CLOSED)
            }
        }

    } catch (error) {
        errorOnOperation(operation, JSON.stringify(error))
    }
}

/**
 * The operation must be activated until the time then will change to close
 * @param operation 
 */
function processActivated(operation: Operation) {
    try {
        let date = getNow()
        for (let index = 0; index < operation.operation_volumes.length; index++) {
            const operationVolume = operation.operation_volumes[index];
            let dateBegin = new Date(operationVolume.effective_time_begin)
            let dateEnd = new Date(operationVolume.effective_time_end)
            if ((date.getTime() > dateEnd.getTime())) {
                changeState(operation, OperationState.CLOSED)
            }
        }

    } catch (error) {
        errorOnOperation(operation, JSON.stringify(error))
    }
}
/**
 * The operation must be Nonconforming for no more than 30 seg
 * @param operation 
 */
function processNonconforming(operation: Operation) {

}

/**
 * The operation must be rouge until the time of end, then will change to close
 * @param operation 
 */
function processRouge(operation: Operation) {
    try {
        let date = getNow()

        for (let index = 0; index < operation.operation_volumes.length; index++) {
            const operationVolume = operation.operation_volumes[index];
            let dateBegin = new Date(operationVolume.effective_time_begin)
            let dateEnd = new Date(operationVolume.effective_time_end)
            if ((date.getTime() > dateEnd.getTime())) {
                changeState(operation, OperationState.CLOSED)
            }
        }

    } catch (error) {
        errorOnOperation(operation, JSON.stringify(error))
    }
}

function processPending(operation: Operation) {
    try {
        let date = getNow()

        for (let index = 0; index < operation.operation_volumes.length; index++) {
            const operationVolume = operation.operation_volumes[index];
            let dateBegin = new Date(operationVolume.effective_time_begin)
            let dateEnd = new Date(operationVolume.effective_time_end)
            if ((date.getTime() > dateEnd.getTime())) {
                changeState(operation, OperationState.CLOSED)
            }
        }
    } catch (error) {
        errorOnOperation(operation, JSON.stringify(error))
    }
}

async function errorOnOperation(operation, error: string) {
    // console.error(`Error on operation: ${operation ? operation.gufi : "Operation sin GUFI"}`)
    logError(`Error on operation: ${operation ? operation.gufi : "Operation sin GUFI"}\n${error}`)
    try {
        operation.state = OperationState.CLOSED
        operation.flight_comments = error
        let result = await operationDao.save(operation)

    } catch (error) {
        console.error(`Error when save on update operation state`)
    }

    try {
        let bodyMail = `<p>${error}</p>${operationMailHtml(operation)}`

        sendMail(adminEmail, "Debido a un error se pasó a CLOSE la operación : " + operation.gufi,
            bodyMail, bodyMail)

    } catch (error) {
        console.error(`Error when send mail`)

    }
}



async function changeState(operation: Operation, newState: OperationState) {
    // console.log(`Change the state of ${operation.gufi} from ${operation.state} to ${newState}`)
    let oldState = operation.state
    operation.state = newState

    let result = await operationDao.save(operation)
    // console.log(`Send mail ${JSON.stringify(operation, null, 2)}`)
    logInfo(`Operation ${operation.gufi} change state from ${oldState} to ${newState}`)
    let operationInfo = {
        gufi: operation.gufi,
        state: newState
    }
    sendMail(adminEmail, "Cambio de estado de operacion " + operation.name, operationMailHtml(operation), operationMailHtml(operation))
    if (operation.owner && operation.owner.email) {
        sendMail([operation.owner.email], "Cambio de estado de operacion " + operation.name, operationMailHtml(operation), operationMailHtml(operation))
    }
    sendOpertationStateChange(operationInfo)
    return result
}



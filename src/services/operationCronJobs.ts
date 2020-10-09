import { OperationDao } from "../daos/OperationDaos";
import { Operation, OperationState } from "../entities/Operation";
import { getNow } from "./dateTimeService";
import { OperationVolume } from "../entities/OperationVolume";
import { UASVolumeReservationDao } from "../daos/UASVolumeReservationDao";
import { RestrictedFlightVolumeDao } from "../daos/RestrictedFlightVolumeDao";
import { sendOpertationStateChange } from "./asyncBrowserComunication";
// import { OperationIntersections } from "../entities/OperationIntersection";
import { Role } from "../entities/User";


import { doSendMailForPendingOperation, doSendMailForNotAcceptedOperation } from "../restControllers/MailController"

let operationDao: OperationDao;
let uvrDao: UASVolumeReservationDao;
let rfvDao: RestrictedFlightVolumeDao;

export async function processOperations() {
    operationDao = new OperationDao()
    uvrDao = new UASVolumeReservationDao()
    rfvDao = new RestrictedFlightVolumeDao()
    // let op : Operation

    let operations = await operationDao.getOperationsForCron()
    for (let index = 0; index < operations.length; index++) {
        const operation: Operation = operations[index];
        // console.log(`Operation: ${operation.gufi}, ${operation.state}`)

        // try {
        switch (operation.state) {
            case OperationState.PROPOSED:
                processProposed(operation)
                break;
            case OperationState.NOT_ACCEPTED:
                processNotAccepted(operation)
                break;
            case OperationState.ACCEPTED:
                processAccepted(operation)
                break;
            case OperationState.ACTIVATED:
                processActivated(operation)
                break;
            case OperationState.NONCONFORMING:
                processNonconforming(operation)
                break;
            case OperationState.ROGUE:
                processRouge(operation)
                break;
            default:
                break;
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
    for (let index = 0; index < operation.operation_volumes.length; index++) {
        const operationVolume = operation.operation_volumes[index];
        // try {
        //     populateIntersections(operation, operationVolume)
        // } catch (error) {
        //     console.error(`------> ERROR AL GUARDAR INTERSECCIONES:: ${JSON.stringify(error)}`)
        // }

        let intersect = await checkIntersection(operation, operationVolume)
        if (intersect && operation.flight_comments) {
            console.log(`------------------------------>>>`)
            let result = await operationDao.save(operation)
        }

        if (intersect) {
            doSendMailForNotAcceptedOperation(operationDao, 
                { receiverMail: operation.owner?operation.owner.email:"emialonzo@gmail.com" , gufi: operation.gufi, bodyMail: "Email generado automaticamente" }, 
                { role: Role.ADMIN, username: "" })
            return changeState(operation, OperationState.NOT_ACCEPTED)
        } else if (await intersectsWithRestrictedFlightVolume(operation, operationVolume)) {
            // let op: Operation = new Operation();
            // op.owner.email
            console.log(`********\n${JSON.stringify(operation,null,2)}\n********`)

            operationDao = new OperationDao()
            let error = await doSendMailForPendingOperation(
                operationDao, 
                { receiverMail: operation.owner?operation.owner.email:"emialonzo@gmail.com" , gufi: operation.gufi, bodyMail: "Email generado automaticamente" }, 
                { role: Role.ADMIN, username: "" })
            return changeState(operation, OperationState.PENDING)
        }
    }


    let changeToActived = false;
    let date = getNow()
    for (let index = 0; index < operation.operation_volumes.length; index++) {
        const operationVolume = operation.operation_volumes[index];
        let dateBegin = new Date(operationVolume.effective_time_begin)
        let dateEnd = new Date(operationVolume.effective_time_end)
        // console.log(`(${date.toISOString()} >= ${dateBegin.toISOString()}) && (${date.toISOString()} < ${dateEnd.toISOString()})`)
        if ((date.getTime() >= dateBegin.getTime()) && (date.getTime() < dateEnd.getTime())) {
            changeToActived = true // changeState(operation, OperationState.ACTIVATED)
        }
    }
    if (changeToActived) {
        changeState(operation, OperationState.ACTIVATED)
    } else {
        changeState(operation, OperationState.ACCEPTED)
    }
}

async function checkIntersection(operation: Operation, operationVolume: OperationVolume) {
    try {
        let operationsCount = await operationDao.countOperationVolumeByVolumeCountExcludingOneOperation(operation.gufi, operationVolume)
        let uvrCount = await uvrDao.countUvrIntersections(operationVolume)
        let msg = operationsCount ? "ANOTHER_OPERATION " : "" + uvrCount ? "UVR " : ""
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
}

/**
 * The operation must be activated until the time then will change to close
 * @param operation 
 */
function processActivated(operation: Operation) {
    let date = getNow()
    for (let index = 0; index < operation.operation_volumes.length; index++) {
        const operationVolume = operation.operation_volumes[index];
        let dateBegin = new Date(operationVolume.effective_time_begin)
        let dateEnd = new Date(operationVolume.effective_time_end)
        if ((date.getTime() > dateEnd.getTime())) {
            changeState(operation, OperationState.CLOSED)
        }
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
    let date = getNow()

    for (let index = 0; index < operation.operation_volumes.length; index++) {
        const operationVolume = operation.operation_volumes[index];
        let dateBegin = new Date(operationVolume.effective_time_begin)
        let dateEnd = new Date(operationVolume.effective_time_end)
        if ((date.getTime() > dateEnd.getTime())) {
            changeState(operation, OperationState.CLOSED)
        }
    }
}

async function changeState(operation: Operation, newState: OperationState) {
    // console.log(`Change the state of ${operation.gufi} from ${operation.state} to ${newState}`)
    operation.state = newState

    let result = await operationDao.save(operation)
    let operationInfo = {
        gufi: operation.gufi,
        state: newState
    }
    sendOpertationStateChange(operationInfo)
    return result
}



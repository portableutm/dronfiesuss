import { OperationDao } from "../daos/OperationDaos";
import { Operation, OperationState } from "../entities/Operation";
import { getNow } from "./dateTimeService";
import { OperationVolume } from "../entities/OperationVolume";
import { UASVolumeReservationDao } from "../daos/UASVolumeReservationDao";

let operationDao: OperationDao;
let uvrDao: UASVolumeReservationDao;

export async function processOperations() {
    operationDao = new OperationDao()
    uvrDao = new UASVolumeReservationDao()
    // let op : Operation

    let operations = await operationDao.getOperationsForCron()
    for (let index = 0; index < operations.length; index++) {
        const operation: Operation = operations[index];
        console.log(`Operation: ${operation.gufi}, ${operation.state}`)

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
        console.log("******* ******* ******* ******* ******* ******* ******* ")
    }
}


/**
 * If a operation is proposed we need to check ir intersects with an other operation volume or uvr
 * @param operation 
 */
async function processProposed(operation: Operation) {
    for (let index = 0; index < operation.operation_volumes.length; index++) {
        const operationVolume = operation.operation_volumes[index];
        let intersect = await checkIntersection(operation, operationVolume)
        console.log(`Intersects is ${intersect}`)
        if (intersect) {
            return changeState(operation, OperationState.NOT_ACCEPTED)
        }
    }
    await changeState(operation, OperationState.ACCEPTED)

    let date = getNow()
    for (let index = 0; index < operation.operation_volumes.length; index++) {
        const operationVolume = operation.operation_volumes[index];
        let dateBegin = new Date(operationVolume.effective_time_begin)
        let dateEnd = new Date(operationVolume.effective_time_end)
        // console.log(`(${date.toISOString()} >= ${dateBegin.toISOString()}) && (${date.toISOString()} < ${dateEnd.toISOString()})`)
        if ((date.getTime() >= dateBegin.getTime()) && (date.getTime() < dateEnd.getTime())) {
            changeState(operation, OperationState.ACTIVATED)
        }
        // if ((date.getTime() > dateEnd.getTime())) {
        //     changeState(operation, OperationState.CLOSED)
        // }
    }
}

async function checkIntersection(operation: Operation, operationVolume: OperationVolume) {
    try {

        let operationsCount = await operationDao.getOperationVolumeByVolumeCountExcludingOneOperation(operation.gufi, operationVolume)
        console.log(`Count uvr`)
        let uvrCount = await uvrDao.countUvrIntersections(operationVolume)
        console.log(`Count uvr ${uvrCount}`)

        // return operationsCount > 0 ;
        return (operationsCount > 0) || (uvrCount > 0);
    } catch (e) {
        console.log(e)
        return true //TODO throw exception
    }
}

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
        console.log(`(${date.toISOString()} >= ${dateBegin.toISOString()}) && (${date.toISOString()} < ${dateEnd.toISOString()})`)
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
    console.log(`Change the state of ${operation.gufi} from ${operation.state} to ${newState}`)
    operation.state = newState
    return await operationDao.save(operation)
}
import { OperationDao } from "../daos/OperationDaos";
import { Operation, OperationState } from "../entities/Operation";
import { getNow } from "./dateTimeService";

let operationDao;

export async function processOperations() {
    operationDao = new OperationDao()
    // let op : Operation
    // let operations = await operationDao.all({state:OperationState.PROPOSED})
    let operations = await operationDao.getOperationsForCron()
    for (let index = 0; index < operations.length; index++) {
        const operation: Operation = operations[index];
        console.log(`Operation: ${operation.gufi}, ${operation.state}`)
        // console.log(JSON.stringify(operation, null, 2))
        
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
    // try {
        for (let index = 0; index < operation.operation_volumes.length; index++) {
            const operationVolume = operation.operation_volumes[index];
            let intersect = await checkIntersection(operationVolume)
            if (intersect) {
                return changeState(operation, OperationState.NOT_ACCEPTED)
            }
        }
        return changeState(operation, OperationState.ACCEPTED)
    // } catch (error) {
    //     console.log(`Error when processProposed ${operation.gufi}`)
    // }
    
}

async function checkIntersection(operationVolume) {
    try {
        let operationsCount = await operationDao.getOperationVolumeByVolumeCount(operationVolume)
        return operationsCount > 0;
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
        if ((date.getTime() >= dateBegin.getTime()) && (date.getTime() < dateEnd.getTime())) {
            changeState(operation, OperationState.ACTIVATED)
        }
    }
}

/**
 * The operation must be activated until the time then will change to close
 * @param operation 
 */
function processActivated(operation: Operation) {

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
        if ((date.getTime() >= dateBegin.getTime()) && (date.getTime() < dateEnd.getTime())) {
            changeState(operation, OperationState.ACTIVATED)
        }
    }
}

async function changeState(operation: Operation, newState: OperationState) {
    console.log(`Change the state of ${operation.gufi} from ${operation.state} to ${newState }`)
    operation.state = newState
    return await operationDao.save(operation)
}
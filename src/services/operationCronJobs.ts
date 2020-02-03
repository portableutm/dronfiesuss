import { OperationDao } from "../daos/OperationDaos";
import { Operation, OperationState } from "../entities/Operation";


export async function proposedToAccepted(){
    let operationDao = new OperationDao()
    // let op : Operation
    let operations = await operationDao.all({state:OperationState.PROPOSED})
    for (let index = 0; index < operations.length; index++) {
        const operation = operations[index];
        console.log(`Operation: ${operation.gufi}, ${operation.state}`)
    }
}
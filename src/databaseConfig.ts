import {createConnection, getConnectionOptions} from "typeorm";

export const createTypeormConn = async (connectionName : string) => {
    const connectionOptions = await getConnectionOptions(connectionName)
    return createConnection({...connectionOptions, name:"default"})
}

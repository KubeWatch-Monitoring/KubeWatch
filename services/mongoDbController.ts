import * as mongoDB from "mongodb";

export class MongoDbController {
    constructor(public db: mongoDB.Db) {
    }

    static async create(): Promise<MongoDbController> {
        if (process.env.DB_CONN_STRING === undefined)
            throw new Error("Environment variable DB_CONN_STRING is missing");
        const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);
        await client.connect();
        return new MongoDbController(client.db("kubewatch"));
    }
}

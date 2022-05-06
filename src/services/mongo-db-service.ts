import * as mongoDB from "mongodb";

export class MongoDbService {
    constructor(public db: mongoDB.Db) {
    }

    static async connect(url: string): Promise<MongoDbService> {
        const mongoClient = new mongoDB.MongoClient(url);
        await mongoClient.connect();
        return new MongoDbService(mongoClient.db("kubewatch"));
    }
}

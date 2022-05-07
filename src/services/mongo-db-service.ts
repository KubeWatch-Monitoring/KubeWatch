import {Db, MongoClient} from "mongodb";
import {Reconnectable} from "./Reconnectable";

export class MongoDbService implements Reconnectable {
    db: Db;

    private constructor(public mongoClient: MongoClient) {
        this.db = mongoClient.db("kubewatch");
    }

    static async connect(url: string): Promise<MongoDbService> {
        const mongoClient = new MongoClient(url);
        await mongoClient.connect();
        return new MongoDbService(mongoClient);
    }

    async reconnect() {
        this.mongoClient.connect();
        this.db = this.mongoClient.db("kubewatch");
    }
}

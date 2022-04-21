import * as mongoDB from "mongodb";

export class MongoDbService {
    constructor(public db: mongoDB.Db) {
    }
}

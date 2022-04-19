import {MongoDbService} from "./mongo-db-service";
import {Collection} from "mongodb";
import {User} from "../model/user";

export class UserStore {
    private userCollection: Collection;

    constructor(mongoDbService: MongoDbService) {
        this.userCollection = mongoDbService.db.collection("users");
    }

    async getUsers() {
        return await this.userCollection.find().toArray() as unknown as User[];
    }

    async createUser(user: User) {
        return await this.userCollection.insertOne(user) as unknown as User;
    }
}

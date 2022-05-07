import {MongoDbService} from "./mongo-db-service";
import {Collection} from "mongodb";
import {User, UserStore} from "../model/user";

export class UserStoreImpl implements UserStore {
    private userCollection: Collection;

    constructor(private mongoDbService: MongoDbService) {
        this.userCollection = mongoDbService.db.collection("users");
    }

    async getUsers() {
        return this.userCollection.find().toArray() as unknown as User[];
    }

    async createUser(user: User) {
        return await this.userCollection.insertOne(user) as unknown as User;
    }

    async reconnect() {
        await this.mongoDbService.reconnect();
    }
}

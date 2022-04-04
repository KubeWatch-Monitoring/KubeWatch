import {MongoDbController} from "./mongoDbController";
import {Collection} from "mongodb";
import {User} from "../model/user";

export class UserStore {
    private userCollection: Collection;

    constructor(dbController: MongoDbController) {
        this.userCollection = dbController.db.collection("users");
    }

    async getUsers() {
        return await this.userCollection.find().toArray() as unknown as User[];
    }

    async createUser(user: User) {
        return await this.userCollection.insertOne(user) as unknown as User;
    }
}
import {ObjectId} from "mongodb";
import {Reconnectable} from "../services/Reconnectable";

export class User {
    public id?: ObjectId;

    constructor(
        public username: string,
        public email: string,
    ) {
    }
}

export interface UserStore extends Reconnectable {
    getUsers(): Promise<User[]>;

    createUser(user: User): Promise<User>;
}

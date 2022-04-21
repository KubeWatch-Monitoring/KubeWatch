import {ObjectId} from "mongodb";

export class User {
    public id?: ObjectId;

    constructor(
        public username: string,
        public email: string,
    ) {
    }
}

export interface UserStore {
    getUsers(): Promise<User[]>;

    createUser(user: User): Promise<User>;
}

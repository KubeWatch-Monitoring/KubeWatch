import {ObjectId, UpdateResult} from "mongodb";

export class Notification {
    constructor(public message: string, public date: Date, public isSilenced: boolean, public reason: string, public _id?: ObjectId) {
    }
}

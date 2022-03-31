import * as mongoDB from "mongodb";
import {User} from "../model/user";

export const collections: { users?: mongoDB.Collection } = {};

export async function connectToDatabase() {
    if (process.env.DB_CONN_STRING === undefined)
        throw new Error("Environment variable DB_CONN_STRING is missing");
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);
    await client.connect();
    const db: mongoDB.Db = client.db("kubewatch");
    const userCollection: mongoDB.Collection = db.collection("users");
    collections.users = userCollection;
    await userCollection.insertOne(new User("John Doe", "john.doe@email.com"));
}

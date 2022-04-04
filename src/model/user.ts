import { ObjectId } from "mongodb";

export class User {
  id?: ObjectId;
  username: string;
  email: string;

  constructor(username: string, email: string) {
    this.username = username;
    this.email = email;
  }
}

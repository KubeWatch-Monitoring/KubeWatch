import Datastore from "nedb-promises";
import { Settings } from "../utils/session-middleware.index";

export class Example {
  public _id: string | undefined;

  constructor(
    public title: string,
    public description: string,
    public creationDate: string
  ) {}
}

export class ExampleStore {
  private db: Datastore;

  constructor(db?: Datastore) {
    this.db =
      db || new Datastore({ filename: "./data/todos.db", autoload: true });
  }

  async insert(todo: Example): Promise<Example> {
    return new Example("Test", "Test", "Test");
  }

  async update(todo: Example): Promise<Example> {
    return new Example("Test", "Test", "Test");
  }

  async get(id: string): Promise<Example> {
    return new Example("Test", "Test", "Test");
  }

  async getAll(displaySettings: Settings): Promise<Example[]> {
    return [new Example("Test", "Test", "Test")];
  }
}

export const exampleStore = new ExampleStore();

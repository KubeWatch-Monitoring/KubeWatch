"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleStore = exports.ExampleStore = exports.Example = void 0;
const nedb_promises_1 = __importDefault(require("nedb-promises"));
class Example {
    constructor(title, description, creationDate) {
        this.title = title;
        this.description = description;
        this.creationDate = creationDate;
    }
}
exports.Example = Example;
class ExampleStore {
    constructor(db) {
        this.db =
            db || new nedb_promises_1.default({ filename: "./data/todos.db", autoload: true });
    }
    async insert(todo) {
        return new Example("Test", "Test", "Test");
    }
    async update(todo) {
        return new Example("Test", "Test", "Test");
    }
    async get(id) {
        return new Example("Test", "Test", "Test");
    }
    async getAll(displaySettings) {
        return [new Example("Test", "Test", "Test")];
    }
}
exports.ExampleStore = ExampleStore;
exports.exampleStore = new ExampleStore();
//# sourceMappingURL=exampleStore.js.map
import {Request, Response} from "express";
import {User} from "../model/user";
import {controllerUtil, ControllerUtil} from "../utils/controller-util";

export class UserController {
    controllerUtil: ControllerUtil;

    constructor(controllerUtil: ControllerUtil) {
        this.controllerUtil = controllerUtil;
    }

    async getUsers(req: Request, res: Response) {
        let users: User[] = [];
        try {
            users = await req.app.userStore.getUsers();
        } catch (e) {
            this.controllerUtil.setDatabaseAvailability(false);
        }
        await this.controllerUtil.render("users", {
            users,
        }, req, res);
    }

    async createUser(req: Request, res: Response) {
        const user = new User(req.body.username, req.body.email);
        await req.app.userStore.createUser(user);
        res.redirect("/users");
    }
}

export const userController = new UserController(controllerUtil);

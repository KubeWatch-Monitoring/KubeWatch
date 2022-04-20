import {Request, Response} from "express";
import {User} from "../model/user";

export class UserController {
    async getUsers(req: Request, res: Response) {
        res.render("users", {
            style: req.session.style,
            display: req.session.display,
            users: await req.app.userStore.getUsers(),
        });
    }

    async createUser(req: Request, res: Response) {
        const user = new User(req.body.username, req.body.email);
        await req.app.userStore.createUser(user);
        res.redirect("/users");
    }
}

export const userController = new UserController();

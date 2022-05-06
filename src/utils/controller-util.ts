import {Request, Response} from "express";

export class ControllerUtil {
    private isDatabaseAvailable = true;

    async render(view: string, data: any, req: Request, res: Response) {
        let pendingNotifications;

        try {
           pendingNotifications = await req.app.notificationStore.getNotSilencedNotifications();
        } catch (e) {
            this.setDatabaseAvailability(false);
        }

        const generalData = {
            style: req.session.style,
            currentUrl: req.originalUrl,
            display: req.session.display,
            isDatabaseAvailable: this.isDatabaseAvailable,
            pendingNotifications,
        };

        res.render(view, {...generalData, ...data});
    }

    setDatabaseAvailability(availability: boolean) {
        this.isDatabaseAvailable = availability;
    }

    getDatabaseAvailability(): boolean {
        return this.isDatabaseAvailable;
    }
}

export const controllerUtil = new ControllerUtil();

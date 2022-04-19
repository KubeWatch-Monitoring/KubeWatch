
(async () => {
    const app = (await import("./app")).app;
    const MongoDbController = (await import("./services/mongoDbController")).MongoDbController;
    const UserStore = (await import("./services/userStore")).UserStore;
    const NotificationStore = (await import("./services/notificationStore")).NotificationStore;
    const prometheusService = (await import("./services/prometheusService")).prometheusService;

    const mongoDbController = await MongoDbController.create();
    app.userStore = new UserStore(mongoDbController);
    app.notificationStore = new NotificationStore(mongoDbController);
    app.prometheusService = prometheusService;

    const PORT = process.env.PORT || 8082;
    app.listen(PORT, () => {
        console.log(
            `Successfully started server at: http://127.0.0.1:${PORT}`
        );
        console.log("Press Ctrl+C to quit.");
    });
})();

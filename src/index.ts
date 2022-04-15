(async () => {
    const app = (await import("./app")).app;
    const MongoDbController = (await import("./services/mongoDbController")).MongoDbController;
    const UserStore = (await import("./services/userStore")).UserStore;
    const NotificationStore = (await import("./services/notificationStore")).NotificationStore;
    const PodStore = (await import("./services/podStore")).PodStore;

    const mongoDbController = await MongoDbController.create();
    app.userStore = new UserStore(mongoDbController);
    app.notificationStore = new NotificationStore(mongoDbController);
    app.podStore = new PodStore();

    const PORT = process.env.PORT || 8082;
    app.listen(PORT, () => {
        console.log(
            `Successfully started server at: http://127.0.0.1:${PORT}`
        );
        console.log("Press Ctrl+C to quit.");
    });
})();

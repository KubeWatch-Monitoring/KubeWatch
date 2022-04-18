(async () => {
    const app = (await import("./app")).app;
    const MongoDbController = (await import("./services/mongoDbController")).MongoDbController;
    const UserStore = (await import("./services/userStore")).UserStore;
    const NotificationStore = (await import("./services/notificationStore")).NotificationStore;
    const PodStore = (await import("./services/podStore")).PodStore;
    const PrometheusWatcher = (await import("./services/prometheusWatcher")).PrometheusWatcher;

    const mongoDbController = await MongoDbController.create();
    const notificationStore = new NotificationStore(mongoDbController);
    const prometheusService = {}; // TODO: Replace this with the prometheusService when finished
    app.userStore = new UserStore(mongoDbController);
    app.notificationStore = notificationStore;
    app.podStore = new PodStore();

    /* Initialize Web App */
    const PORT = process.env.PORT || 8082;
    app.listen(PORT, () => {
        console.log(
            `Successfully started server at: http://127.0.0.1:${PORT}`
        );
        console.log("Press Ctrl+C to quit.");
    });

    /* Initialize PrometheusWatcher */
    const watcher = new PrometheusWatcher(notificationStore, prometheusService);
    watcher.onNotification(notificationStore);
})();

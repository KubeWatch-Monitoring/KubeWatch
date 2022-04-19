(async () => {
    const app = (await import("./app")).app;
    const MongoDbController = (await import("./services/mongoDbController")).MongoDbController;
    const UserStore = (await import("./services/userStore")).UserStore;
    const NotificationStore = (await import("./services/notificationStore")).NotificationStore;
    const PrometheusWatcher = (await import("./services/prometheusWatcher")).PrometheusWatcher;
    const prometheusService = (await import("./services/prometheusService")).prometheusService;
    const SettingsStore = (await import("./services/settingsStore")).SettingsStore;

    const mongoDbController = await MongoDbController.create();
    const notificationStore = new NotificationStore(mongoDbController);
    const settingsStore = new SettingsStore(mongoDbController);
    app.userStore = new UserStore(mongoDbController);
    app.settingsStore = settingsStore;
    app.notificationStore = new NotificationStore(mongoDbController);
    app.prometheusService = prometheusService;

    /* Initialize Web App */
    const PORT = process.env.PORT || 8082;
    app.listen(PORT, () => {
        console.log(
            `Successfully started server at: http://127.0.0.1:${PORT}`
        );
        console.log("Press Ctrl+C to quit.");
    });

    /* Initialize PrometheusWatcher */
    const watcher = new PrometheusWatcher(settingsStore, prometheusService);
    watcher.onNotification(notificationStore);
    watcher.watchPrometheus();
})();

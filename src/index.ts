(async () => {
    const app = (await import("./app")).app;
    const MongoClient = (await import("mongodb")).MongoClient;
    const MongoDbService = (await import("./services/mongo-db-service")).MongoDbService;
    const UserStore = (await import("./services/user-store")).UserStore;
    const NotificationStore = (await import("./services/notification-store")).NotificationStore;
    const PrometheusWatcher = (await import("./services/prometheus-watcher")).PrometheusWatcher;
    const SettingsStore = (await import("./services/setting-store")).SettingStore;
    const PrometheusDriver = (await import("prometheus-query")).PrometheusDriver
    const PrometheusService = (await import("./services/prometheus-service")).PrometheusService;
    const PodStore = (await import("./services/pod-store")).PodStore;

    if (process.env.DB_CONN_STRING === undefined)
        throw new Error("Environment variable DB_CONN_STRING is missing");
    const mongoClient = new MongoClient(process.env.DB_CONN_STRING);
    await mongoClient.connect();
    const mongoDbService = new MongoDbService(mongoClient.db("kubewatch"));
    app.userStore = new UserStore(mongoDbService);

    const notificationStore = new NotificationStore(mongoDbService);
    app.notificationStore = notificationStore;
    app.settingsStore = new SettingsStore(mongoDbService);

    if (process.env.PROMETHEUS_CONN_STRING === undefined)
        throw new Error("Environment variable PROMETHEUS_CONN_STRING is missing");
    const prometheusDriver = new PrometheusDriver({
        endpoint: process.env.PROMETHEUS_CONN_STRING,
        baseURL: "/api/v1",
    });
    app.prometheusService = new PrometheusService(prometheusDriver);
    app.podStore = new PodStore(app.prometheusService);
    const prometheusWatcher = new PrometheusWatcher(app.settingsStore, app.prometheusService);
    prometheusWatcher.onNotification(notificationStore);
    prometheusWatcher.watchPrometheus();
    app.prometheusWatcher = prometheusWatcher;

    const PORT = process.env.PORT || 8082;
    app.listen(PORT, () => {
        console.log(`Successfully started server at: http://127.0.0.1:${PORT}`);
        console.log("Press Ctrl+C to quit.");
    });
})();

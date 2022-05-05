(async () => {
    const app = (await import("./app")).app;
    const MongoClient = (await import("mongodb")).MongoClient;
    const MongoDbService = (await import("./services/mongo-db-service")).MongoDbService;
    const UserStoreImpl = (await import("./services/user-store-impl")).UserStoreImpl;
    const NotificationStoreImpl = (await import("./services/notification-store-impl")).NotificationStoreImpl;
    const SettingsStore = (await import("./services/setting-store-impl")).SettingStoreImpl;
    const PrometheusDriver = (await import("prometheus-query")).PrometheusDriver
    const PrometheusService = (await import("./services/prometheus-service")).PrometheusService;
    const NotificationManager = (await import("./domain/notification-manager")).NotificationManager;
    const ThresholdMonitor = (await import("./domain/threshold-monitor")).ThresholdMonitor;
    const PodStoreImpl = (await import("./services/pod-store-impl")).PodStoreImpl;
    const ClusterDataImpl = (await import ("./services/cluster-data-impl")).ClusterDataImpl;

    if (process.env.DB_CONN_STRING === undefined)
        throw new Error("Environment variable DB_CONN_STRING is missing");
    const mongoClient = new MongoClient(process.env.DB_CONN_STRING);
    await mongoClient.connect();
    const mongoDbService = new MongoDbService(mongoClient.db("kubewatch"));

    app.userStore = new UserStoreImpl(mongoDbService);
    const notificationStore = new NotificationStoreImpl(mongoDbService);
    app.notificationStore = notificationStore;
    app.settingsStore = new SettingsStore(mongoDbService);

    if (process.env.PROMETHEUS_CONN_STRING === undefined)
        throw new Error("Environment variable PROMETHEUS_CONN_STRING is missing");
    const prometheusService = new PrometheusService();
    app.podStore = new PodStoreImpl(prometheusService);
    app.notificationManager = new NotificationManager();
    app.notificationManager.addNotificationHandler(notificationStore);
    const thresholdMonitor = new ThresholdMonitor(app.settingsStore, app.podStore, app.notificationManager);
    thresholdMonitor.monitorPods();

    app.clusterData = new ClusterDataImpl();

    const PORT = process.env.PORT || 8082;
    app.listen(PORT, () => {
        console.log(`Successfully started server at: http://127.0.0.1:${PORT}`);
        console.log("Press Ctrl+C to quit.");
    });
})();

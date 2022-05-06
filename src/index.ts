(async () => {
    const app = (await import("./app")).app;
    const setupDatabaseServices = (await import("./app")).setupDatabaseServices;
    const setupPrometheusServices = (await import("./app")).setupPrometheusServices;
    const ThresholdMonitor = (await import("./domain/threshold-monitor")).ThresholdMonitor;

    if (process.env.DB_CONN_STRING === undefined)
        throw new Error("Environment variable DB_CONN_STRING is missing");

    try {
        await setupDatabaseServices();
    } catch (e) {
        throw new Error(`Could not connect to the database with connection string: ${process.env.DB_CONN_STRING}`);
    }

    await setupPrometheusServices();
    const thresholdMonitor = new ThresholdMonitor(app.settingsStore, app.podStore, app.notificationManager);
    thresholdMonitor.monitorPods();
    const PORT = process.env.PORT || 8082;
    app.listen(PORT, () => {
        console.log(`Successfully started server at: http://127.0.0.1:${PORT}`);
        console.log("Press Ctrl+C to quit.");
    });
})();

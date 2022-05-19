import {MongoDbService} from "./services/mongo-db-service";
import {NotificationStoreImpl} from "./services/notification-store-impl";
import {SettingStoreImpl} from "./services/setting-store-impl";
import {ChartSettingStoreImpl} from "./services/chart-setting-store-impl";
import {PrometheusService} from "./services/prometheus-service";
import {PodStoreImpl} from "./services/pod-store-impl";
import {ClusterDataStoreImpl} from "./services/cluster-data-store-impl";
import {app} from "./app";
import {DatabaseFillManager} from "./services/database-fill-manager";
import {DatabasePrefillImpl} from "./model/database-prefill";
import {EnvironmentVariable, EnvironmentVariables} from "./services/env-store-impl";

async function setupDatabaseStores(environmentVariables: EnvironmentVariables) {
    try {
        const mongoDbService = await MongoDbService.connect(environmentVariables.mongodbConnectionString);
        app.notificationStore = new NotificationStoreImpl(mongoDbService);
        app.settingsStore = new SettingStoreImpl(mongoDbService);
        app.chartSettingStore = new ChartSettingStoreImpl(mongoDbService);
    } catch (e) {
        // TODO: Log message of e?
        throw new Error(`Could not connect to the database with connection string: ${environmentVariables.mongodbConnectionString}`);
    }
}

async function setupPrometheusStores(environmentVariables: EnvironmentVariables) {
    try {
        const prometheusService = PrometheusService.connect(environmentVariables.prometheusConnectionString);
        app.podStore = new PodStoreImpl(prometheusService);
        app.clusterDataStore = new ClusterDataStoreImpl(prometheusService);
    } catch (e) {
        // TODO: Log message of e?
        throw new Error(`Could not connect to prometheus with connection string: ${environmentVariables.mongodbConnectionString}`);
    }
}

(async () => {
    const app = (await import("./app")).app
    const ThresholdMonitor = (await import("./domain/threshold-monitor")).ThresholdMonitor;
    const NotificationManager = (await import("./domain/notification-manager")).NotificationManager;
    const AmazonSnsService = (await import("./services/amazon-sns-service")).AmazonSnsService;
    const EnvStore = (await import("./services/env-store-impl")).EnvStoreImpl;

    const envStore = new EnvStore();

    const environmentVariables: EnvironmentVariables = {
        expressSessionSecret: envStore.getEnvVar(EnvironmentVariable.EXPRESS_SESSION_SECRET),
        mongodbConnectionString: envStore.getEnvVar(EnvironmentVariable.DB_CONN_STRING),
        prometheusConnectionString: envStore.getEnvVar(EnvironmentVariable.PROMETHEUS_CONN_STRING),
        awsSnsRegion: envStore.getEnvVar(EnvironmentVariable.AWS_SNS_REGION),
        awsSnsAccessKeyId: envStore.getEnvVar(EnvironmentVariable.AWS_SNS_ACCESS_KEY_ID),
        awsSnsSecretAccessKey: envStore.getEnvVar(EnvironmentVariable.AWS_SNS_SECRET_ACCESS_KEY),
        awsSnsSessionToken: envStore.getEnvVar(EnvironmentVariable.AWS_SNS_SESSION_TOKEN),
    };

    await setupDatabaseStores(environmentVariables);
    await setupPrometheusStores(environmentVariables);

    const thresholdMonitor = new ThresholdMonitor(app.settingsStore, app.podStore, app.notificationManager);
    thresholdMonitor.monitorPods();

    app.environmentVariables = environmentVariables;
    app.notificationManager = new NotificationManager();
    app.notificationManager.addNotificationHandler(app.notificationStore);

    try {
        const amazonSnsService = await AmazonSnsService.connect(
            environmentVariables.awsSnsRegion,
            environmentVariables.awsSnsAccessKeyId,
            environmentVariables.awsSnsSecretAccessKey,
            environmentVariables.awsSnsSessionToken,
        );
        app.notificationManager.addNotificationHandler(amazonSnsService);
    } catch (e) {
        console.log(e);
    }
    const mongoDbService = await MongoDbService.connect(environmentVariables.mongodbConnectionString);
    const databaseFillManger = new DatabaseFillManager(mongoDbService);

    if (!await databaseFillManger.isDatabaseFilledUp()) {
        await databaseFillManger.fillUpDatabase(new DatabasePrefillImpl());
        await databaseFillManger.setDatabaseFillUp(true);
    }

    const PORT = process.env.PORT || 8082;
    app.listen(PORT, () => {
        console.log(`Successfully started server at: http://127.0.0.1:${PORT}`);
        console.log("Press Ctrl+C to quit.");
    });
})();

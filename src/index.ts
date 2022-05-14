import {MongoDbService} from "./services/mongo-db-service";
import {NotificationStoreImpl} from "./services/notification-store-impl";
import {SettingStoreImpl} from "./services/setting-store-impl";
import {ChartSettingStoreImpl} from "./services/chart-setting-store-impl";
import {PrometheusService} from "./services/prometheus-service";
import {PodStoreImpl} from "./services/pod-store-impl";
import {ClusterDataStoreImpl} from "./services/cluster-data-store-impl";
import {app} from "./app";

interface EnvironmentVariables {
    expressSessionSecret: string,
    mongodbConnectionString: string,
    prometheusConnectionString: string,
    awsSnsRegion: string,
    awsSnsAccessKeyId: string,
    awsSnsSecretAccessKey: string,
    awsSnsSessionToken: string,
}

enum EnvironmentVariable {
    EXPRESS_SESSION_SECRET = "EXPRESS_SESSION_SECRET",
    DB_CONN_STRING = "DB_CONN_STRING",
    PROMETHEUS_CONN_STRING = "PROMETHEUS_CONN_STRING",
    AWS_SNS_REGION = "AWS_SNS_REGION",
    AWS_SNS_ACCESS_KEY_ID = "AWS_SNS_ACCESS_KEY_ID",
    AWS_SNS_SECRET_ACCESS_KEY = "AWS_SNS_SECRET_ACCESS_KEY",
    AWS_SNS_SESSION_TOKEN = "AWS_SNS_SESSION_TOKEN",
}

function getEnvVar(name: EnvironmentVariable): string {
    const value = process.env[name];
    if (value === undefined)
        throw new Error(`Environment variable ${name} is missing`);
    return value;
}

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

    const environmentVariables: EnvironmentVariables = {
        expressSessionSecret: getEnvVar(EnvironmentVariable.EXPRESS_SESSION_SECRET),
        mongodbConnectionString: getEnvVar(EnvironmentVariable.DB_CONN_STRING),
        prometheusConnectionString: getEnvVar(EnvironmentVariable.PROMETHEUS_CONN_STRING),
        awsSnsRegion: getEnvVar(EnvironmentVariable.AWS_SNS_REGION),
        awsSnsAccessKeyId: getEnvVar(EnvironmentVariable.AWS_SNS_ACCESS_KEY_ID),
        awsSnsSecretAccessKey: getEnvVar(EnvironmentVariable.AWS_SNS_SECRET_ACCESS_KEY),
        awsSnsSessionToken: getEnvVar(EnvironmentVariable.AWS_SNS_SESSION_TOKEN),
    };

    await setupDatabaseStores(environmentVariables);
    await setupPrometheusStores(environmentVariables);

    const thresholdMonitor = new ThresholdMonitor(app.settingsStore, app.podStore, app.notificationManager);
    thresholdMonitor.monitorPods();

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

    const PORT = process.env.PORT || 8082;
    app.listen(PORT, () => {
        console.log(`Successfully started server at: http://127.0.0.1:${PORT}`);
        console.log("Press Ctrl+C to quit.");
    });
})();

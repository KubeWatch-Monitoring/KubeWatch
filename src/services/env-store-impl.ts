export interface EnvironmentVariables {
    expressSessionSecret: string,
    mongodbConnectionString: string,
    prometheusConnectionString: string,
    awsSnsRegion: string,
    awsSnsAccessKeyId: string,
    awsSnsSecretAccessKey: string,
    awsSnsSessionToken: string,
}

export enum EnvironmentVariable {
    EXPRESS_SESSION_SECRET = "EXPRESS_SESSION_SECRET",
    DB_CONN_STRING = "DB_CONN_STRING",
    PROMETHEUS_CONN_STRING = "PROMETHEUS_CONN_STRING",
    AWS_SNS_REGION = "AWS_SNS_REGION",
    AWS_SNS_ACCESS_KEY_ID = "AWS_SNS_ACCESS_KEY_ID",
    AWS_SNS_SECRET_ACCESS_KEY = "AWS_SNS_SECRET_ACCESS_KEY",
    AWS_SNS_SESSION_TOKEN = "AWS_SNS_SESSION_TOKEN",
}

export class EnvStoreImpl {
    getEnvVar(name: EnvironmentVariable): string {
        const value = process.env[name];
        if (value === undefined)
            throw new Error(`Environment variable ${name} is missing`);
        return value;
    }
}


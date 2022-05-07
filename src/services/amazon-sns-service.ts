import * as SNS from '@aws-sdk/client-sns';
import {NotificationHandler} from "../domain/notification-manager";
import {Notification} from "../model/notification";

export class AmazonSnsService implements NotificationHandler {
    private client: SNS.SNSClient;
    private topicArn!: string;

    static async connect(region: string, accessKeyId: string, secretAccessKey: string, sessionToken: string) {
        const service = new AmazonSnsService(region, accessKeyId, secretAccessKey, sessionToken);
        const command = new SNS.ListTopicsCommand({});
        const response: SNS.ListTopicsCommandOutput = await service.client.send(command);
        const topics = response.Topics;
        if (topics == undefined || topics[0].TopicArn === undefined) throw new Error("There are no SNS topics");
        service.topicArn = topics[0].TopicArn;
        return service;
    }

    private constructor(region: string, accessKeyId: string, secretAccessKey: string, sessionToken: string) {
        const options: SNS.SNSClientConfig = {
            region: region,
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
                sessionToken: sessionToken,
            }
        };
        this.client = new SNS.SNSClient(options);
    }

    async onNotification(notification: Notification): Promise<void> {
        // TODO Add subject to notification
        const input: SNS.PublishCommandInput = {
            TopicArn: this.topicArn,
            Message: notification.message,
        }
        const command = new SNS.PublishCommand(input);
        await this.client.send(command);
    }
}

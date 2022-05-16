import * as SNS from '@aws-sdk/client-sns';
import {NotificationHandler} from "../domain/notification-manager";
import {Notification, NotificationSubscriberStore} from "../model/notification";


export class AmazonSnsService implements NotificationSubscriberStore, NotificationHandler {
    private client: SNS.SNSClient;
    private topicArn!: string;

    static async connect(region: string, accessKeyId: string, secretAccessKey: string, sessionToken: string) {
        const service = new AmazonSnsService(region, accessKeyId, secretAccessKey, sessionToken);
        const command = new SNS.ListTopicsCommand({});
        const response: SNS.ListTopicsResponse = await service.client.send(command);
        const topics = response.Topics;
        if (topics == undefined || topics[0].TopicArn === undefined || !topics[0].TopicArn.endsWith("KubeWatch"))
            throw new Error("There is no KubeWatch SNS topic");
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

    async listEmailSubscribers() {
        const input: SNS.ListSubscriptionsByTopicInput = {
            TopicArn: this.topicArn,
        }
        const command = new SNS.ListSubscriptionsByTopicCommand(input);
        const response: SNS.ListSubscriptionsByTopicResponse = await this.client.send(command);
        return response.Subscriptions?.filter(s => s.Protocol == "email").map(s => s.Endpoint) as string[];
    }

    async addEmailSubscriber(email: string) {
        const input: SNS.SubscribeInput = {
            TopicArn: this.topicArn,
            Protocol: "email",
            Endpoint: email,
        }
        const command = new SNS.SubscribeCommand(input);
        await this.client.send(command);
    }

    async removeEmailSubscriber(email: string) {
        const input: SNS.ListSubscriptionsByTopicInput = {
            TopicArn: this.topicArn,
        }
        const command = new SNS.ListSubscriptionsByTopicCommand(input);
        const response: SNS.ListSubscriptionsByTopicResponse = await this.client.send(command);
        const subscribers = response.Subscriptions?.filter(s => s.Endpoint == email) ?? [];
        if (subscribers.length == 0) throw new Error("There is no subscriber with the email " + email);

        for (const subscriber of subscribers) {
            const input2: SNS.UnsubscribeInput = {
                SubscriptionArn: subscriber.SubscriptionArn,
            }
            const command = new SNS.UnsubscribeCommand(input2);
            await this.client.send(command);
        }
    }

    isAvailable() {
        return true;
    }
}

export class AmazonSnsServiceProxy implements NotificationSubscriberStore, NotificationHandler {
    private readonly isConnected;

    private constructor(private service?: AmazonSnsService) {
        this.isConnected = service !== undefined;
    }

    static async connect(region: string, accessKeyId: string, secretAccessKey: string, sessionToken: string) {
        try {
            return new AmazonSnsServiceProxy(await AmazonSnsService.connect(region, accessKeyId, secretAccessKey, sessionToken));
        } catch (e) {
            return new AmazonSnsServiceProxy();
        }
    }

    async onNotification(notification: Notification) {
        if(this.isConnected) {
            this.service?.onNotification(notification);
        }
    }

    async addEmailSubscriber(email: string): Promise<void> {
        if(this.isConnected) {
            this.service?.addEmailSubscriber(email);
        }
    }

    async listEmailSubscribers(): Promise<string[]> {
        if(this.isConnected) {
            return this.service?.listEmailSubscribers() ?? [];
        } else {
            return [];
        }
    }
    async removeEmailSubscriber(email: string): Promise<void> {
        if(this.isConnected) {
            this.service?.removeEmailSubscriber(email);
        }
    }

    isAvailable(): boolean {
        return this.isConnected;
    }
}

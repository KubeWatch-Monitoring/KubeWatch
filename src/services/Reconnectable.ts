export interface Reconnectable {
    reconnect(): Promise<void>;
}

export interface IPushGateway {
    send(deviceToken: string, title: string, body: string, data?: Record<string, any>): Promise<string>;
    isAvailable(): Promise<boolean>;
}

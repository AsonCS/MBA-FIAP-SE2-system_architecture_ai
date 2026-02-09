import { EmailAddress } from '../domain/value-objects';

export interface IMailGateway {
    send(to: EmailAddress, subject: string, body: string, from?: EmailAddress): Promise<string>;
    isAvailable(): Promise<boolean>;
}

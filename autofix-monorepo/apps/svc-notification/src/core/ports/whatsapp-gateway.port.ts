import { PhoneNumber } from '../domain/value-objects';

export interface IWhatsAppGateway {
    send(to: PhoneNumber, message: string, templateName?: string): Promise<string>;
    isAvailable(): Promise<boolean>;
}

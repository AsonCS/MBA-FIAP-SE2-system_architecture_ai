import { PhoneNumber } from '../domain/value-objects';

export interface ISmsGateway {
    send(to: PhoneNumber, message: string): Promise<string>;
    isAvailable(): Promise<boolean>;
}

import { Twilio } from 'twilio';
import { ISmsGateway } from '../../core/ports';
import { PhoneNumber } from '../../core/domain/value-objects';

export class TwilioSmsProvider implements ISmsGateway {
    private client: Twilio;
    private fromNumber: PhoneNumber;

    constructor(
        accountSid: string = process.env.TWILIO_ACCOUNT_SID || '',
        authToken: string = process.env.TWILIO_AUTH_TOKEN || '',
        fromNumber: string = process.env.TWILIO_FROM_NUMBER || '',
    ) {
        if (!accountSid || !authToken || !fromNumber) {
            throw new Error('Twilio credentials are required');
        }

        this.client = new Twilio(accountSid, authToken);
        this.fromNumber = new PhoneNumber(fromNumber);
    }

    async send(to: PhoneNumber, message: string): Promise<string> {
        try {
            const result = await this.client.messages.create({
                body: message,
                from: this.fromNumber.getValue(),
                to: to.getValue(),
            });

            return result.sid;
        } catch (error) {
            // Twilio error codes: https://www.twilio.com/docs/api/errors
            const statusCode = error.status || 500;

            if (statusCode >= 400 && statusCode < 500) {
                // Client error - don't retry
                throw new Error(`Twilio SMS client error: ${error.message}`);
            } else {
                // Server error - can retry
                const retryableError: any = new Error(`Twilio SMS server error: ${error.message}`);
                retryableError.statusCode = statusCode;
                retryableError.retryable = true;
                throw retryableError;
            }
        }
    }

    async isAvailable(): Promise<boolean> {
        try {
            await this.client.api.accounts(this.client.accountSid).fetch();
            return true;
        } catch (error) {
            return false;
        }
    }
}

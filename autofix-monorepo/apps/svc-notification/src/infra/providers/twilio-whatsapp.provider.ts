import { Twilio } from 'twilio';
import { IWhatsAppGateway } from '../../core/ports';
import { PhoneNumber } from '../../core/domain/value-objects';

export class TwilioWhatsAppProvider implements IWhatsAppGateway {
    private client: Twilio;
    private fromNumber: PhoneNumber;

    constructor(
        accountSid: string = process.env.TWILIO_ACCOUNT_SID || '',
        authToken: string = process.env.TWILIO_AUTH_TOKEN || '',
        fromNumber: string = process.env.TWILIO_WHATSAPP_NUMBER || '',
    ) {
        if (!accountSid || !authToken || !fromNumber) {
            throw new Error('Twilio credentials are required');
        }

        this.client = new Twilio(accountSid, authToken);
        // WhatsApp numbers must be prefixed with 'whatsapp:'
        this.fromNumber = new PhoneNumber(fromNumber);
    }

    async send(to: PhoneNumber, message: string, templateName?: string): Promise<string> {
        try {
            const result = await this.client.messages.create({
                body: message,
                from: `whatsapp:${this.fromNumber.getValue()}`,
                to: `whatsapp:${to.getValue()}`,
            });

            return result.sid;
        } catch (error) {
            const statusCode = error.status || 500;

            if (statusCode >= 400 && statusCode < 500) {
                throw new Error(`Twilio WhatsApp client error: ${error.message}`);
            } else {
                const retryableError: any = new Error(`Twilio WhatsApp server error: ${error.message}`);
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

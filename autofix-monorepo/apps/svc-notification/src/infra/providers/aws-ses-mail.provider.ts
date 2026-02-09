import * as AWS from 'aws-sdk';
import { IMailGateway } from '../../core/ports';
import { EmailAddress } from '../../core/domain/value-objects';

export class AwsSesMailProvider implements IMailGateway {
    private ses: AWS.SES;
    private defaultFrom: EmailAddress;

    constructor(
        region: string = process.env.AWS_REGION || 'us-east-1',
        defaultFromEmail: string = process.env.DEFAULT_FROM_EMAIL || 'noreply@autofix.com',
    ) {
        this.ses = new AWS.SES({ region });
        this.defaultFrom = new EmailAddress(defaultFromEmail);
    }

    async send(
        to: EmailAddress,
        subject: string,
        body: string,
        from?: EmailAddress,
    ): Promise<string> {
        const params: AWS.SES.SendEmailRequest = {
            Source: (from || this.defaultFrom).getValue(),
            Destination: {
                ToAddresses: [to.getValue()],
            },
            Message: {
                Subject: {
                    Data: subject,
                    Charset: 'UTF-8',
                },
                Body: {
                    Html: {
                        Data: body,
                        Charset: 'UTF-8',
                    },
                },
            },
        };

        try {
            const result = await this.ses.sendEmail(params).promise();
            return result.MessageId || 'unknown';
        } catch (error) {
            // Differentiate between 4xx and 5xx errors
            if (error.statusCode >= 400 && error.statusCode < 500) {
                // Client error - don't retry
                throw new Error(`AWS SES client error: ${error.message}`);
            } else {
                // Server error - can retry
                const retryableError: any = new Error(`AWS SES server error: ${error.message}`);
                retryableError.statusCode = error.statusCode || 500;
                retryableError.retryable = true;
                throw retryableError;
            }
        }
    }

    async isAvailable(): Promise<boolean> {
        try {
            await this.ses.getSendQuota().promise();
            return true;
        } catch (error) {
            return false;
        }
    }
}

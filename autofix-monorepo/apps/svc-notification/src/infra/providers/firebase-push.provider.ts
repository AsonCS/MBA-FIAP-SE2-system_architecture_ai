import * as admin from 'firebase-admin';
import { IPushGateway } from '../../core/ports';

export class FirebasePushProvider implements IPushGateway {
    private messaging: admin.messaging.Messaging;

    constructor(serviceAccountPath?: string) {
        if (!admin.apps.length) {
            const serviceAccount = serviceAccountPath || process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

            if (serviceAccount) {
                admin.initializeApp({
                    credential: admin.credential.cert(require(serviceAccount)),
                });
            } else {
                // Use default credentials (for Cloud Run, etc.)
                admin.initializeApp();
            }
        }

        this.messaging = admin.messaging();
    }

    async send(
        deviceToken: string,
        title: string,
        body: string,
        data?: Record<string, any>,
    ): Promise<string> {
        const message: admin.messaging.Message = {
            token: deviceToken,
            notification: {
                title,
                body,
            },
            data: data ? this.sanitizeData(data) : undefined,
        };

        try {
            const messageId = await this.messaging.send(message);
            return messageId;
        } catch (error) {
            // Firebase error codes: https://firebase.google.com/docs/cloud-messaging/send-message#admin_sdk_error_reference
            const errorCode = error.code;

            // Client errors (invalid token, etc.)
            if (
                errorCode === 'messaging/invalid-argument' ||
                errorCode === 'messaging/invalid-recipient' ||
                errorCode === 'messaging/registration-token-not-registered'
            ) {
                throw new Error(`Firebase Push client error: ${error.message}`);
            } else {
                // Server errors
                const retryableError: any = new Error(`Firebase Push server error: ${error.message}`);
                retryableError.statusCode = 500;
                retryableError.retryable = true;
                throw retryableError;
            }
        }
    }

    async isAvailable(): Promise<boolean> {
        try {
            // Simple health check - Firebase SDK is available
            return !!this.messaging;
        } catch (error) {
            return false;
        }
    }

    private sanitizeData(data: Record<string, any>): Record<string, string> {
        // Firebase data payload must be string key-value pairs
        const sanitized: Record<string, string> = {};

        for (const [key, value] of Object.entries(data)) {
            if (value !== null && value !== undefined) {
                sanitized[key] = typeof value === 'string' ? value : JSON.stringify(value);
            }
        }

        return sanitized;
    }
}

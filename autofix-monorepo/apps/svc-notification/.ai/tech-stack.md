# Technology Stack - svc-notification

## 1. Core Frameworks
* **Language:** TypeScript
* **Backend Framework:** NestJS
* **Style:** Clean Architecture + Event-Driven

## 2. Communication
* **Asynchronous (Primary):** Kafka
    * Consumer for Domain Events (e.g., `UserRegistered`).
    * Use of Dead Letter Queues (DLQ) for failed notification handling.

## 3. Storage
* **Primary Database:** PostgreSQL
    * `notification_history` table for auditing and status tracking.
* **Template Storage:** Filesystem or Postgres depending on dynamic requirements.

## 4. Third-Party Integration (Adapters)
* **Email:** AWS SES / SendGrid.
* **SMS/WhatsApp:** Twilio / Zenvia.
* **Push:** Firebase FCM.

## 5. Utilities
* **Template Engine:** Handlebars or Mustache (for simple, safe variable injection).
* **Validation:** Class-validator for sanitizing inputs.

## 6. Key Ports Interface
```typescript
export interface IMailGateway {
  send(to: EmailAddress, subject: string, body: string): Promise<string>; 
}

export interface INotificationRepository {
  logAttempt(notification: Notification): Promise<void>;
  updateStatus(id: string, status: NotificationStatus, meta?: any): Promise<void>;
}
```

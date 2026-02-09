# Business Rules - svc-notification

## 1. Notification Aggregate Logic
* **Status Lifecycle:** `PENDING` -> `SENT` or `FAILED`.
* **Retry Policy:** Attempt sending up to 3 times with exponential backoff before sending to Dead Letter Queue.
* **Audit Trail:** Maintain full history of recipient, channel, and provider response for at least X days/months for legal compliance.

## 2. Global Rules
* **Opt-Out:** (Future requirement) Respect user communication preferences.
* **Formatting:** All phone numbers must be normalized to E.164 format.
* **Variable Injection:** Use `TemplateEngine` to ensure all required variables for a specific template are present before attempting a send.

## 3. User Stories (Use Cases)
* **US01:** Send Welcome Email upon `UserRegistered` event.
* **US02:** Send WhatsApp notification when Work Order status changes to "Ready".
* **US03:** Send Password Recovery Link immediately upon request.
* **US04:** Audit failing/bouncing emails to identify invalid customer contacts.

## 4. Operational Flows

### Event Consumption & Send
1. Listen to Kafka (e.g., `UserRegistered`).
2. Log initial attempt as `PENDING`.
3. Select appropriate template based on event key.
4. Render HTML/Text using event payload variables.
5. Attempt external API call (e.g., SendGrid).
6. Update Log status with `MessageID` or `Error`.
7. Commit Kafka offset if successful or permanent failure.

### Resilience Flow
* If Provider returns a 5xx error -> Retry (Wait -> Try again).
* If Provider returns a 4xx error (Validation/Logic) -> Mark as `FAILED` (no retry).
* If retries exhausted -> Move to DLQ and alert ops.

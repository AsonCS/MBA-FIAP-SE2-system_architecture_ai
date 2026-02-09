# Coding Standards - svc-notification

## 1. Architectural Patterns
* **Clean Architecture:** Strict isolation of core domain logic (templates, mapping) from infrastructure (Kafka, providers).
* **Ports and Adapters:** All interaction with third-party providers (Email/SMS/Push) must be done through interfaces defined in `core/ports`.
* **Event-Driven:** The service is primarily a consumer of events. Architecture should prioritize asynchronous processing and resilience.

## 2. Naming Conventions
* **Interfaces (Ports):** Prefix with `I` (e.g., `IEmailProvider`, `INotificationRepository`).
* **Adapters:** Suffix with the provider name (e.g., `AwsSesEmailProvider`, `TwilioSmsProvider`).
* **Handlers:** Suffix with `Handler` (e.g., `SendWelcomeEmailHandler`).
* **Value Objects:** Descriptive names (e.g., `EmailAddress`, `PhoneNumber`).

## 3. Implementation Rules
* **Idempotency:** Ensure that processing the same Kafka message multiple times does not result in duplicate emails/SMS to the customer.
* **Resilience:** Implement retry policies with exponential backoff for external provider failures.
* **Statelessness:** Use metadata and logging for state tracking rather than in-memory state.
* **Template Safety:** Always use a template engine that provides safe escaping to prevent XSS or injection in communications.

## 4. Documentation & Logging
* **Notification History:** Every attempt must be logged in the database with status and provider reference.
* **Bounces/Failures:** Implement logic to handle and log permanent failures (bounces) to improve sender reputation.

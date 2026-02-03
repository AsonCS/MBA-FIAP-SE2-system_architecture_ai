# Repositórios e Data Sources

O serviço de notificação é "Stateless" na execução, mas "Stateful" na auditoria.

## Interfaces (Ports)
O Core define **O QUE** precisa ser feito, não **COMO**.

```typescript
// core/ports/IMailGateway.ts
export interface IMailGateway {
  send(to: EmailAddress, subject: string, body: string): Promise<string>; // Retorna Provider ID
}

// core/ports/INotificationRepository.ts
export interface INotificationRepository {
  logAttempt(notification: Notification): Promise<void>;
  updateStatus(id: string, status: NotificationStatus, meta?: any): Promise<void>;
}

```

## Data Sources

1. **Kafka (Source of Truth):**
* O serviço reage a eventos. Não possui API REST para "criar notificação" diretamente (salvo testes). O gatilho é sempre um evento de domínio de outro serviço.


2. **PostgreSQL (Logs):**
* Tabela: `notification_history`.
* Armazena quem recebeu, quando e o conteúdo (se necessário, por questões legais).


3. **Provedores Externos (APIs):**
* AWS SES / SendGrid (Email).
* Twilio / Zenvia (SMS/WhatsApp).
* Firebase FCM (Push Mobile).

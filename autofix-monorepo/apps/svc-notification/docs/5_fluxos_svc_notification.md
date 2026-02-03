# Fluxos Principais

## Fluxo 1: Consumo de Evento e Envio (Happy Path)
O fluxo padrão onde um evento de negócio dispara uma notificação.

```mermaid
sequenceDiagram
    participant Kafka
    participant Listener as KafkaController
    participant Handler as NotifyUserHandler
    participant Engine as TemplateService
    participant Adapter as EmailProvider (SendGrid)
    participant Repo as NotificationRepo

    Kafka->>Listener: Event: "UserRegistered" payload: { email, name }
    Listener->>Handler: handle(event)
    
    Handler->>Repo: logAttempt(PENDING)
    
    Handler->>Engine: compile("WELCOME_TEMPLATE", { name })
    Engine-->>Handler: HTML Renderizado
    
    Handler->>Adapter: send(email, html)
    
    alt Sucesso no Envio
        Adapter-->>Handler: MessageID: "sg_12345"
        Handler->>Repo: updateStatus(SENT, "sg_12345")
        Handler-->>Kafka: Commit Offset
    else Erro no Provider
        Adapter--x Handler: Error 500
        Handler->>Repo: updateStatus(FAILED)
        Note right of Handler: Lança erro para Kafka (Retry)
    end

```

## Fluxo 2: Retry Pattern (Resiliência)

Como o sistema lida com instabilidades no provedor de email.

```mermaid
graph TD
    Start((Kafka Msg)) --> TryProcessing
    
    TryProcessing[Tenta Enviar Email]
    
    TryProcessing -->|Sucesso| Commit[Commit Offset]
    TryProcessing -->|Erro Temporário 503| CheckRetry{Retry Count < 3?}
    
    CheckRetry -->|Sim| Wait[Backoff: Espera X seg]
    Wait --> TryProcessing
    
    CheckRetry -->|Não| DLQ[Envia para Dead Letter Queue]
    DLQ --> Alert[Alerta Admin]

```

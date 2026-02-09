# Guia de Implementação - svc-notification

Este documento descreve o plano técnico e as diretrizes para a implementação do microserviço `svc-notification`, responsável por centralizar a comunicação (E-mail, SMS, WhatsApp, Push) e isolar o sistema de provedores externos.

## 1. Sequência de Desenvolvimento

Seguindo a **Clean Architecture** e o modelo **Event-Driven**, a implementação deve progredir conforme as fases abaixo:

| Fase | Camada | Descrição |
|:--- |:--- |:--- |
| **1** | **Core/Domain** | Agregado `Notification`, Entidade `Template`, VOs (`Email`, `Phone`) e `TemplateEngine`. |
| **2** | **Core/Ports** | Interfaces para Provedores (`IMailGateway`, `ISmsGateway`) e Repositório de Logs. |
| **3** | **Core/Application** | Handlers de Eventos (ex: `SendWelcomeEmailHandler`) e Comandos de Notificação. |
| **4** | **Infra/Adapters** | Implementação de Adapters (AWS SES, Twilio, Firebase) e Repositório PostgreSQL. |
| **5** | **Infra/Messaging** | Consumidores Kafka para tópicos de domínio (`auth.*`, `work-order.*`). |

---

## 2. Detalhes Técnicos de Implementação

### 2.1 Camada Core (Independente de Provedor)

#### Agregado e Entidades (`src/core/domain`)
- **Notification:** Raiz de auditoria. Deve trackear o `status` (PENDING, SENT, FAILED, BOUNCED) e a resposta do provedor.
- **MessageTemplate:** Define a estrutura (`subject`, `body`) e variáveis obrigatórias para cada tipo de mensagem.

#### Value Objects (`src/core/domain/value-objects`)
- **EmailAddress / PhoneNumber:** Validação e normalização (E.164 para telefones).
- **Content:** Encapsula o assunto e corpo já processados e prontos para envio.

#### Domain Services (`src/core/domain/services`)
- **TemplateEngine:** Responsável por injetar variáveis nos templates (usando Handlebars ou Mustache).
- **ProviderSelector:** (Opcional) Lógica para alternar entre provedores em caso de falha (Fallback).

### 2.2 Camada de Infraestrutura (Adapters)

#### Provedores Externos (`src/infra/providers`)
- **Adapters Concretos:** Implementar as interfaces de porta para AWS SES (E-mail), Twilio (SMS/WhatsApp) e Firebase (Push).
- **Tratamento de Erros:** Diferenciar erros 4xx (não repetir) de 5xx (aplicar política de retry).

#### Persistência de Auditoria (`src/infra/database`)
- **NotificationLog:** Salvar histórico completo em PostgreSQL para conformidade legal e suporte ao cliente.

#### Camada de Mensageria (`src/infra/messaging`)
- **Kafka Consumers:** O serviço é majoritariamente reativo. Deve ouvir eventos como `UserRegistered` e `WorkOrderApproved`.
- **Idempotência:** Usar o ID do evento original ou uma chave de idempotência para evitar envios duplicados.

---

## 3. Lógica de Casos de Uso Críticos

### 3.1 Consumo e Envio Reativo
1. Receber evento do Kafka (ex: `UserRegistered`).
2. Criar log de notificação com status `PENDING`.
3. Compilar o template correspondente com os dados do evento.
4. Tentar envio através do adapter de infraestrutura.
5. Em caso de sucesso: Atualizar para `SENT` e registrar `providerId`.
6. Em caso de erro 5xx: Lançar exceção para acionar o Retry do Kafka.

### 3.2 Política de Resiliência (Retry/Backoff)
1. Aplicar **Exponential Backoff** para falhas temporárias nos provedores.
2. Limite de 3 tentativas por mensagem.
3. Se o limite for atingido: Mover para **Dead Letter Queue (DLQ)** e alertar a operação.

---

## 4. Padrões e Convenções

- **Estratégia Stateless:** O Core não deve manter estado de envio entre execuções; toda a persistência deve ser delegada ao repositório de infra.
- **Segurança nos Templates:** Garantir escaping de caracteres para evitar injeções ou XSS.
- **Nomenclatura:**
    - Ports: `IMailGateway`, `INotificationRepository`.
    - Adapters: `AwsSesMailProvider`, `TwilioSmsProvider`.
    - Handlers: `SendWelcomeEmailHandler`.

---

## 5. Próximos Passos
1. Setup do projeto NestJS no monorepo para `svc-notification`.
2. Configuração de tópicos Kafka e mapeamento de eventos para templates.
3. Implementação do `TemplateEngine` com Handlebars.
4. Configuração das credenciais de sandbox (SendGrid/AWS) para testes.

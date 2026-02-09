# svc-notification

Microserviço de notificações do sistema AutoFix, responsável por centralizar o envio de comunicações via E-mail, SMS, WhatsApp e Push Notifications.

## 📋 Visão Geral

O `svc-notification` é um serviço event-driven que consome eventos de outros microserviços e envia notificações através de diferentes canais, isolando a complexidade de integração com provedores externos.

## 🏗️ Arquitetura

- **Clean Architecture**: Separação clara entre domínio, aplicação e infraestrutura
- **Event-Driven**: Consumo de eventos via Kafka
- **Ports & Adapters**: Interfaces para provedores externos
- **Domain-Driven Design**: Agregados, entidades e value objects

## 🚀 Tecnologias

- **Framework**: NestJS + TypeScript
- **Database**: PostgreSQL (auditoria)
- **Messaging**: Kafka
- **Template Engine**: Handlebars
- **Providers**:
  - Email: AWS SES
  - SMS/WhatsApp: Twilio
  - Push: Firebase FCM

## 📁 Estrutura de Diretórios

```
src/
├── core/
│   ├── domain/
│   │   ├── aggregates/     # Notification
│   │   ├── entities/       # MessageTemplate
│   │   ├── value-objects/  # Email, Phone, Priority, Content
│   │   └── services/       # TemplateEngine, ProviderSelector
│   ├── ports/              # Interfaces (IMailGateway, ISmsGateway, etc.)
│   └── application/
│       ├── commands/       # SendNotificationCommand
│       └── handlers/       # Event handlers
├── infra/
│   ├── database/           # TypeORM entities, repositories, mappers
│   ├── providers/          # AWS SES, Twilio, Firebase adapters
│   └── messaging/          # Kafka consumers
└── config/                 # Configuration files
```

## 🔧 Configuração

1. Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

2. Configure as variáveis de ambiente no `.env`

3. Instale as dependências:
```bash
npm install
```

4. Execute as migrações do banco:
```bash
npm run migration:run
```

## 🏃 Executando

### Desenvolvimento
```bash
npm run start:dev
```

### Produção
```bash
npm run build
npm start
```

### Docker
```bash
docker-compose up -d
```

## 📝 Casos de Uso

### US01: Enviar E-mail de Boas-Vindas
Consome evento `UserRegistered` e envia e-mail de boas-vindas.

### US02: Notificar Status da Ordem
Consome evento `WorkOrderStatusChanged` e envia WhatsApp.

### US03: Recuperação de Senha
Consome evento `PasswordRecoveryRequested` e envia e-mail com link.

## 🔄 Fluxo de Notificação

1. Evento é consumido do Kafka
2. Notificação é criada com status `PENDING`
3. Template é compilado com variáveis do evento
4. Envio é tentado via provider apropriado
5. Status é atualizado para `SENT` ou `FAILED`
6. Em caso de erro 5xx, retry é acionado
7. Após 3 tentativas, mensagem vai para DLQ

## 🛡️ Resiliência

- **Retry Policy**: Exponential backoff para erros 5xx
- **Idempotência**: Previne envios duplicados
- **Fallback**: Seleção automática de provider alternativo
- **DLQ**: Dead Letter Queue para mensagens com falha permanente

## 📊 Auditoria

Todas as tentativas de envio são registradas no PostgreSQL com:
- Status da notificação
- Resposta do provider
- Timestamp de cada tentativa
- Metadata adicional

## 🧪 Testes

```bash
# Unit tests
npm test

# Coverage
npm run test:cov
```

## 📚 Documentação Adicional

- [Arquitetura](/.ai/architecture.md)
- [Regras de Negócio](/.ai/business-rules.md)
- [Padrões de Código](/.ai/standards.md)
- [Stack Tecnológico](/.ai/tech-stack.md)

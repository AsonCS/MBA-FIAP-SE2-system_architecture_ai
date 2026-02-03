# DDD: Agregados, Entidades e Value Objects

## 1. Agregado Principal: NotificationLog
Representa o registro histórico de uma tentativa de comunicação. É crucial para auditoria e debugging ("O cliente diz que não recebeu o email").

* **Raiz:** `Notification`
* **Atributos:**
    * `id`: UUID.
    * `channel`: Enum (`EMAIL`, `SMS`, `WHATSAPP`, `PUSH`).
    * `recipient`: String (Destinatário normalizado).
    * `status`: Enum (`PENDING`, `SENT`, `FAILED`, `BOUNCED`).
    * `providerResponse`: JSON (ID da transação no SendGrid/Twilio).
    * `retryCount`: Number.
* **Comportamentos:**
    * `markAsSent(providerId)`: Atualiza status e data de envio.
    * `markAsFailed(error)`: Registra erro e incrementa retry.

## 2. Entidades de Suporte
* **Template:**
    * Define a estrutura da mensagem. Pode ser armazenado no banco ou em arquivos.
    * Atributos: `key` (ex: `WELCOME_EMAIL`), `subjectTemplate`, `bodyTemplate`, `requiredVariables`.

## 3. Value Objects (VOs)
* **EmailAddress:** Valida Regex de email.
* **PhoneNumber:** Normaliza para E.164 (ex: `+5511999999999`).
* **Content:** Objeto contendo `subject` e `body` já renderizados após a injeção de variáveis.

## 4. Domain Services
* **TemplateEngine:** Serviço puro que recebe um `Template` (ex: "Olá {{name}}") e um `Context` (ex: `{ name: "João" }`) e retorna o texto final.
* **ProviderSelector:** (Opcional) Lógica para escolher provedor mais barato ou "fallback" (se Twilio cair, tenta AWS SNS).

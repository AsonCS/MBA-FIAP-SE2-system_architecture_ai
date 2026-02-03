# Domain Driven Design no BFF

No contexto de um API Gateway/BFF, o "Domínio" não são as regras de negócio core (como calcular impostos), mas sim a **Composição e Apresentação** dos dados.

## 1. Agregados (Composite Aggregates)
São estruturas de dados ricas que combinam informações de múltiplos microserviços para entregar tudo o que uma tela precisa em uma única requisição.

* **DashboardAggregate:**
    * *Responsabilidade:* Alimentar a tela inicial do mecânico.
    * *Composição:*
        * `UserSummary` (Vindo do Auth Service)
        * `WorkOrderStats` (Vindo do WorkOrder Service)
        * `LowStockAlerts` (Vindo do Inventory Service)
        * `Notifications` (Vindo do Notification Service)

## 2. Entidades (BFF Entities)
Objetos que possuem identidade dentro da sessão do usuário ou contexto da requisição.

* **SessionContext:** Mantém os dados do usuário logado, permissões (Claims) e Tenant ID, enriquecidos após a validação do token JWT.

## 3. Value Objects (Presentation VOs)
Objetos imutáveis formatados para consumo do Frontend.

* **UISatusColor:** Mapeia o status técnico (`IN_PROGRESS`) para a cor do badge na UI (`#blue-500`) e texto amigável (`Em Andamento`).
* **MaskedDocument:** CPF ou CNPJ mascarado para exibição segura.

## 4. Event Driven (BFF Side)
O Gateway atua tanto como produtor quanto consumidor (para invalidar caches ou push notifications).

* **Server-Sent Events (SSE):** O Gateway assina tópicos do Kafka (ex: `OS_UPDATED`) e repassa para o Frontend via SSE/WebSocket para atualização em tempo real.

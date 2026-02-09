# Guia de Implementação - svc-work-order

Este documento descreve o plano técnico e as diretrizes para a execução do microserviço `svc-work-order`, responsável pela gestão completa do ciclo de vida das Ordens de Serviço (O.S.), integrando orçamentação, execução e finalização.

## 1. Sequência de Desenvolvimento

Seguindo a **Clean Architecture** e o **DDD**, a implementação deve seguir as fases:

| Fase | Camada | Descrição |
|:--- |:--- |:--- |
| **1** | **Core/Domain** | Agregado `WorkOrder`, Entidades (`PartItem`, `ServiceItem`), VOs (`Money`, `Snapshots`). |
| **2** | **Core/Ports** | Interfaces (`IWorkOrderRepository`, `IInventoryGateway`). |
| **3** | **Core/Application** | Casos de Uso (Commands: `CreateWorkOrder`, `AddItem`, `FinishOrder`; Queries). |
| **4** | **Infra/Adapters** | Implementação TypeORM (Snapshots em JSONB), ACL para o `svc-inventory` e Outbox Pattern. |
| **5** | **Infra/API** | Controllers REST para interface com o frontend e Listeners Kafka. |

---

## 2. Detalhes Técnicos de Implementação

### 2.1 Camada Core (Lógica de Negócio)

#### Agregado Principal (`src/core/domain/aggregates`)
- **WorkOrder:** Raiz de consistência. Deve gerenciar a lista de itens (`PartItem` ou `ServiceItem`) e disparar o recálculo automático de totais (`totalParts`, `totalLabor`, `totalAmount`) a cada alteração.
- **Isolamento:** Uso obrigatório de `tenantId` para garantir que os dados sejam isolados por oficina.

#### Value Objects (`src/core/domain/value-objects`)
- **Money:** Tratamento financeiro rigoroso (inteiros em centavos) para evitar erros de ponto flutuante.
- **WorkOrderStatus:** Implementar como uma Máquina de Estados estrita (Ex: impede transição de `DRAFT` diretamente para `COMPLETED`).
- **Snapshots (Vehicle/Customer):** Armazenar cópias imutáveis dos dados no momento da criação da O.S. para preservar o histórico.

#### Contratos (Ports) (`src/core/ports`)
- `IWorkOrderRepository`: Métodos para salvar e buscar O.S.
- `IInventoryGateway`: Definição de contrato para verificação síncrona de estoque via Anti-Corruption Layer (ACL).

### 2.2 Camada de Infraestrutura (Adapters)

#### Banco de Dados e Confiabilidade (`src/infra/database`)
- **JSONB Snapshots:** Utilizar o suporte a JSONB do PostgreSQL para persistir os VOs de Snapshot, simplificando consultas históricas.
- **Outbox Pattern:** Implementar uma tabela de `outbox` para garantir que o evento `WorkOrder.Completed` seja publicado no Kafka de forma atômica com a transação do banco de dados.

#### Integração Externa (ACL) (`src/infra/adapters`)
- **InventoryAdapter:** Implementar a lógica de comunicação (HTTP/gRPC) com o `svc-inventory`, traduzindo os DTOs externos para o modelo de domínio do `svc-work-order`.

#### Mensageria (`src/infra/messaging`)
- **Kafka Producers:** Publicar eventos de mudança de status e finalização.
- **Background Worker:** Implementar o processo que lê a tabela de outbox e despacha para o Kafka.

---

## 3. Lógica de Casos de Uso Críticos

### 3.1 Adição de Item com Validação Síncrona
1. Validar a existência e disponibilidade da peça via `IInventoryGateway` (Síncrono).
2. Se disponível, adicionar o item ao Agregado `WorkOrder`.
3. O Agregado recalcula os totais internos.
4. Salvar a O.S. atualizada.

### 3.2 Finalização de O.S. (Transacional)
1. Alterar status para `COMPLETED`.
2. Iniciar transação no banco de dados.
3. Persistir a `WorkOrder`.
4. Registrar o evento `OrderCompleted` na tabela de `outbox`.
5. Commitar a transação.
*(O worker de background garantirá que o evento chegue ao Kafka para baixar o estoque no `svc-inventory`)*.

---

## 4. Padrões e Convenções

- **Snapshots:** Dados externos (cliente e veículo) NUNCA devem ser referenciados apenas por ID para histórico; use sempre o Snapshot.
- **Cálculos:** Toda lógica de impostos ou descontos deve residir em **Domain Services** (ex: `TaxCalculator`).
- **Nomenclatura:**
    - Commands: `CreateWorkOrderCommand`, `AddItemCommand`.
    - Gateways: `InventoryGateway`, `CatalogGateway`.
    - Repositórios: `TypeOrmWorkOrderRepository`.

---

## 5. Próximos Passos
1. Setup do projeto NestJS e definição do Schema do banco de dados (PostgreSQL).
2. Implementação do Agregado `WorkOrder` com lógica de Máquina de Estados.
3. Implementação da tabela de Outbox e do worker de publicação.
4. Configuração do Client gRPC/HTTP para integração com o `svc-inventory`.

# Business Rules - svc-work-order

## 1. WorkOrder Aggregate Logic
* **Transactional Integrity:** Adding/removing items must always recalculate the O.S. totals (`totalParts`, `totalLabor`, `totalAmount`).
* **Multi-tenancy:** All operations must be scoped by `tenantId`.
* **Polymorphism:** Order items can be either `PartItem` (physical parts) or `ServiceItem` (labor/hours).

## 2. Status Lifecycle (State Machine)
* **DRAFT:** Initial state for diagnosing.
* **PENDING_APPROVAL:** Quotation ready, waiting for customer response.
* **APPROVED:** Inventory is checked/reserved. Work can start.
* **IN_PROGRESS:** Mechanic actively working on the vehicle.
* **COMPLETED:** Final state. Triggers inventory deduction and invoicing.
* **CANCELED:** Work stopped. Releases any reserved inventory.

## 3. Crucial Value Objects
* **Money:** Handles all financial data securely (using cents).
* **Snapshots:** `VehicleSnapshot` and `CustomerSnapshot` store immutable data at the time of O.S. creation to ensure historical accuracy.

## 4. User Stories
* **US01:** Mecânico cria rascunho de O.S. para diagnóstico.
* **US02:** Adição de peças/serviços com cálculo automático e link para aprovação.
* **US03:** Mudança para "Em Progresso" para sinalizar box ocupado.
* **US04:** Finalização disparando baixa de estoque e atualização de histórico.

## 5. Critical Flows

### Item Addition with Stock Check
1. Receive request (ID, SKU, Qty).
2. Sychronously check availability via `IInventoryGateway`.
3. If available, add item to Aggregate.
4. Recalculate O.S. totals.
5. Save Aggregate.

### Order Completion (Transactional)
1. Set status to `COMPLETED`.
2. Start Database Transaction.
3. Save `WorkOrder` entity.
4. Save `OrderCompleted` event in the Outbox Table.
5. Commit Transaction.
6. (Background) Push Outbox events to Kafka.

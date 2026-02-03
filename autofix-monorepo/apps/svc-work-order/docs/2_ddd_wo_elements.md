# DDD: Agregados, Entidades e Value Objects

## 1. Agregado Principal: WorkOrder (O.S.)
O Agregado garante a consistência transacional. Nenhuma peça é adicionada sem recalcular o total da O.S.

* **Raiz:** `WorkOrder`
* **Atributos:**
    * `id`: UUID
    * `tenantId`: UUID (Isolamento)
    * `status`: WorkOrderStatus (State Machine)
    * `totalParts`: Money
    * `totalLabor`: Money
    * `totalAmount`: Money (Soma de Parts + Labor)
* **Composição:**
    * `items`: List<WorkOrderItem>
    * `customer`: CustomerSnapshot (VO)
    * `vehicle`: VehicleSnapshot (VO)

## 2. Entidades Internas
* **WorkOrderItem:** Entidade abstrata/polimórfica.
    * **PartItem:** Representa uma peça física. Tem `sku`, `quantity`, `unitPrice`.
    * **ServiceItem:** Representa mão de obra. Tem `serviceType`, `hours`, `hourlyRate`.

## 3. Value Objects (VOs)
* **Money:** Fundamental para evitar erros de ponto flutuante.
    * Propriedades: `amount` (int - centavos), `currency` (BRL).
    * Métodos: `add()`, `subtract()`, `multiply()`, `allocate()`.
* **WorkOrderStatus:** Enum com lógica de transição.
    * Estados: `DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `IN_PROGRESS`, `COMPLETED`, `CANCELED`.
    * Regra: Não pode ir de `DRAFT` direto para `COMPLETED`.
* **VehicleSnapshot:** Cópia imutável dos dados do veículo no momento da criação da O.S. Se o cliente mudar de carro ou placa depois, o histórico da O.S. antiga permanece intacto.

## 4. Event Driven Design (Eventos de Integração)
Eventos públicos que este serviço emite para o barramento (Kafka):

* `WorkOrder.Created`: Notifica Dashboard.
* `WorkOrder.StatusChanged`: Gatilho para notificações (Email/SMS).
* `WorkOrder.Completed`: **Crítico**. Gatilho para o `svc-inventory` baixar o estoque real e `svc-finance` gerar a fatura.

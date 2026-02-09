# Business Rules - svc-inventory

## 1. Core Domain Logic (Product Aggregate)
* **Stock Management:**
    * `addStock(qty, cost)`: Increments current stock and may trigger price updates.
    * `reserve(qty)`: Moves quantity from `available` to `reserved`. Fails if `available < qty`.
    * `confirmConsumption(qty)`: Decrements `reserved` stock permanently.
    * `releaseReservation(qty)`: Returns `reserved` quantity back to `available`.
* **Integrity:** `currentStock` can never be negative.

## 2. Value Objects
* **SKU:** Unique business identifier (e.g., `OIL-FIL-001`).
* **Quantity:** Handles arithmetic; prevents negative values.

## 3. User Stories
* **US01:** Entry of stock via invoice/fiscal document. Update quantities and average cost.
* **US02:** Alerts for replenishment. Triggered when `currentStock < minStockLevel`.
* **US03:** Automatic reservation upon work order approval.
* **US04:** Audit trail (Kardex). Full history of every stock move.

## 4. Critical Flows

### Stock Reservation (Reactive)
1. Consume `WorkOrder.Approved` event.
2. Load Product by SKU.
3. Call `product.reserve(qty)`.
4. Persist change with **Optimistic Lock** (Version check).
5. If version mismatch, retry.
6. Update Redis cache.

### Stock Consumption
1. Consume `WorkOrder.Completed` event.
2. Load Product.
3. Call `product.confirmConsumption(qty)`.
4. Create `StockMovement` (Type: OUT, Reason: WORK_ORDER).
5. Persist both within a database transaction.

## 5. Domain Events
* `LowStockDetected`: Sent when replenishment is needed.
* `PriceChanged`: Sent when new stock arrives with a different cost.
* `StockAdjusted`: Sent for manual corrections/audits.

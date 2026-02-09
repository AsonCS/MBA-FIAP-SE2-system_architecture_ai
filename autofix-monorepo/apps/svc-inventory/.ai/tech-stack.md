# Technology Stack - svc-inventory

## 1. Core Frameworks
* **Language:** TypeScript
* **Backend Framework:** NestJS
* **Architecture:** Clean Architecture + CQRS

## 2. Persistence & Storage
* **Primary Database:** PostgreSQL
    * Handles ACID transactions for stock integrity.
    * Uses Optimistic Locking (version column) for concurrency.
* **Read Cache:** Redis
    * Stores catalog views (`SKU -> { price, availability }`).
    * Updated via domain events (Look-aside pattern).

## 3. Communication
* **Asynchronous:** Kafka
    * Consumer: Listens to `work-order.events`.
    * Producer: Publishes `LowStockDetected`, `PriceChanged`.
* **Synchronous:** REST (Internal/Admin) and gRPC for fast health-checks or item details.

## 4. Key Libraries
* **ORM:** TypeORM or Prisma (supporting versioning/locking).
* **Validation:** Class-validator (DTO level).

## 5. Repository Interfaces (Ports)
```typescript
interface IProductRepository {
  findBySku(sku: string): Promise<Product>;
  save(product: Product, version: number): Promise<void>; 
}

interface IMovementRepository {
  log(movement: StockMovement): Promise<void>;
}
```

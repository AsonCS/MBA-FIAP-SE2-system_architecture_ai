# Coding Standards - svc-inventory

## 1. Architectural Patterns
* **Clean Architecture:** Strict isolation of core domain logic. No framework dependencies in `core/domain`.
* **DDD (Domain-Driven Design):** Use of Aggregates (Product), Entities, and Value Objects.
* **CQRS (Command-Query Responsibility Segregation):** Separation of write operations (Commands) and read operations (Queries) in the application layer.

## 2. Naming Conventions
* **Aggregates/Entities:** Suffix with nothing (e.g., `Product`, `StockMovement`).
* **Value Objects:** Descriptive names (e.g., `SKU`, `Quantity`).
* **Interfaces (Ports):** Prefix with `I` (e.g., `IProductRepository`, `IMovementRepository`).
* **Use Cases:** Categorized into `Commands` (e.g., `AdjustStock`) and `Queries` (e.g., `GetProductAvailability`).

## 3. Implementation Rules
* **Concurrency Control:** Use **Optimistic Locking** (versioning) on the `Product` entity to prevent race conditions during reservations.
* **Integrity:** The database must be the final barrier (e.g., `check (available_stock >= 0)`).
* **Immutability:** Domain events and stock movement logs should be immutable.
* **Idempotency:** Messaging consumers must implement idempotency checks to avoid duplicate processing of work order events.

## 4. Performance & Reliability
* **Caching:** Use a read-model in Redis for fast availability checks.
* **Eventual Consistency:** Updates to the Redis cache and notifications to other services via Kafka follow the primary database transaction.

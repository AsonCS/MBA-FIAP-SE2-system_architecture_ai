# Coding Standards - svc-work-order

## 1. Architectural Patterns
* **Clean Architecture:** Strict separation between core business logic and infrastructure. The `core` layer must be framework-agnostic.
* **DDD (Domain-Driven Design):** Use of Aggregates, Entities, and Value Objects. The `WorkOrder` aggregate is the consistency boundary.
* **Ports and Adapters:** Define interfaces (ports) in the `core` layer for repositories and external gateways.
* **Outbox Pattern:** Use an outbox table to ensure reliable publishing of integration events to Kafka.

## 2. Naming Conventions
* **Aggregates:** Root entity name (e.g., `WorkOrder`).
* **Entities:** Internal entities (e.g., `OrderItem`, `PartItem`, `ServiceItem`).
* **Value Objects:** Descriptive names for properties (e.g., `Money`, `WorkOrderStatus`, `VehicleSnapshot`).
* **Ports:** Prefix with `I` (e.g., `IWorkOrderRepository`, `IInventoryGateway`).
* **Use Cases:** Suffix with `UseCase` or split into `Commands`/`Queries`.

## 3. Implementation Rules
* **Financial Calculations:** Always use the `Money` Value Object (avoid floating-point issues). Store amounts in cents (integers).
* **Immutability:** Use snapshots (e.g., `VehicleSnapshot`, `CustomerSnapshot`) to preserve the state of related data at the time of O.S. creation.
* **State Machine:** Enforce strict status transitions within the `WorkOrder` aggregate (e.g., no shortcut from `DRAFT` to `COMPLETED`).
* **Validation:** Validations must be part of the domain entities to prevent invalid states.

## 4. Reliability & Consistency
* **Transactional Integrity:** Complex use cases (like finishing an order) must use a single database transaction for the entity update and outbox event logging.
* **Anti-Corruption Layer (ACL):** External services must be accessed via gateways that translate remote data structures into domain-friendly models.

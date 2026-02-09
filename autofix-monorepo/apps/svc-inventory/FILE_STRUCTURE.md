# File Structure - svc-inventory

```
svc-inventory/
├── .ai/                          # AI-generated documentation
│   ├── architecture.md           # Architecture overview
│   ├── business-rules.md         # Business rules and domain logic
│   ├── standards.md              # Coding standards
│   └── tech-stack.md             # Technology stack details
│
├── docs/                         # Additional documentation
│   ├── 1_estrutura_svc_inventory.md
│   ├── 2_ddd_inventory_elements.md
│   ├── 3_repos_datasources.md
│   ├── 4_historias_usuario.md
│   └── 5_fluxos_svc_inventory.md
│
├── src/
│   ├── core/                     # Core domain layer (framework-independent)
│   │   ├── domain/
│   │   │   ├── aggregates/       # Aggregate roots
│   │   │   │   └── product.aggregate.ts
│   │   │   ├── entities/         # Domain entities
│   │   │   │   ├── stock-movement.entity.ts
│   │   │   │   └── supplier.entity.ts
│   │   │   ├── value-objects/    # Value objects
│   │   │   │   ├── sku.vo.ts
│   │   │   │   ├── quantity.vo.ts
│   │   │   │   ├── money.vo.ts
│   │   │   │   └── dimensions.vo.ts
│   │   │   ├── events/           # Domain events
│   │   │   │   ├── domain-event.base.ts
│   │   │   │   ├── low-stock-detected.event.ts
│   │   │   │   ├── price-changed.event.ts
│   │   │   │   └── stock-adjusted.event.ts
│   │   │   └── exceptions/       # Domain exceptions
│   │   │       └── domain.exceptions.ts
│   │   │
│   │   ├── ports/                # Interface definitions (Dependency Inversion)
│   │   │   ├── product.repository.interface.ts
│   │   │   ├── movement.repository.interface.ts
│   │   │   ├── event.interface.ts
│   │   │   └── cache.service.interface.ts
│   │   │
│   │   └── application/          # Use cases (CQRS)
│   │       ├── commands/         # Write operations
│   │       │   ├── adjust-stock.command.ts
│   │       │   ├── adjust-stock.handler.ts
│   │       │   ├── reserve-stock.command.ts
│   │       │   ├── reserve-stock.handler.ts
│   │       │   ├── consume-stock.command.ts
│   │       │   └── consume-stock.handler.ts
│   │       ├── queries/          # Read operations
│   │       │   ├── get-product-availability.query.ts
│   │       │   ├── get-product-availability.handler.ts
│   │       │   ├── get-stock-ledger.query.ts
│   │       │   └── get-stock-ledger.handler.ts
│   │       └── application.module.ts
│   │
│   ├── infra/                    # Infrastructure layer (framework-specific)
│   │   ├── database/             # Database implementation
│   │   │   ├── entities/         # TypeORM entities
│   │   │   │   ├── product.entity.ts
│   │   │   │   └── stock-movement.entity.ts
│   │   │   ├── repositories/     # Repository implementations
│   │   │   │   ├── typeorm-product.repository.ts
│   │   │   │   └── typeorm-movement.repository.ts
│   │   │   └── database.module.ts
│   │   │
│   │   ├── cache/                # Cache implementation
│   │   │   ├── redis-cache.service.ts
│   │   │   └── cache.module.ts
│   │   │
│   │   ├── messaging/            # Event-driven messaging
│   │   │   ├── kafka-event-publisher.service.ts
│   │   │   ├── handlers/
│   │   │   │   ├── work-order-approved.handler.ts
│   │   │   │   └── work-order-completed.handler.ts
│   │   │   └── messaging.module.ts
│   │   │
│   │   └── api/                  # REST API layer
│   │       ├── controllers/
│   │       │   └── inventory.controller.ts
│   │       └── dtos/
│   │           └── inventory.dto.ts
│   │
│   ├── app.module.ts             # Main application module
│   └── main.ts                   # Application entry point
│
├── test/                         # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .dockerignore                 # Docker ignore file
├── .env.example                  # Environment variables template
├── Dockerfile                    # Docker configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── 01_impl.md                    # Implementation guide
├── README.md                     # Service documentation
├── QUICKSTART.md                 # Quick start guide
└── FILE_STRUCTURE.md             # This file
```

## Layer Responsibilities

### Core Layer (Domain + Application)
- **Domain**: Pure business logic, no framework dependencies
  - Aggregates: Consistency boundaries (Product)
  - Value Objects: Immutable domain concepts (SKU, Quantity, Money)
  - Events: Domain events for event-driven architecture
  - Exceptions: Domain-specific errors
  
- **Ports**: Interfaces for external dependencies (Dependency Inversion Principle)
  
- **Application**: Use cases implementing business workflows
  - Commands: Write operations (CQRS)
  - Queries: Read operations (CQRS)

### Infrastructure Layer
- **Database**: TypeORM entities and repositories
- **Cache**: Redis implementation for read projections
- **Messaging**: Kafka producers and consumers
- **API**: REST controllers and DTOs

## Key Design Patterns

1. **Clean Architecture**: Dependency rule (inner layers don't depend on outer layers)
2. **CQRS**: Separate read and write models
3. **DDD**: Aggregates, Value Objects, Domain Events
4. **Repository Pattern**: Abstract data access
5. **Dependency Injection**: NestJS modules for loose coupling
6. **Optimistic Locking**: Version-based concurrency control
7. **Cache-Aside**: Redis for read performance
8. **Event-Driven**: Kafka for async communication

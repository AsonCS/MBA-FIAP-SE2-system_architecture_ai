# Coding Standards - svc-auth

## 1. Architectural Patterns
* **Clean Architecture:** Strict separation between core business logic and infrastructure. The `core` layer must have zero dependencies on external frameworks (NestJS, TypeORM, etc.).
* **DDD (Domain-Driven Design):** Use of Aggregates, Entities, and Value Objects to model the domain.
* **Ports and Adapters:** Define interfaces (ports) in the `core` layer and implement them in the `infra` layer.

## 2. Naming Conventions
* **Interfaces:** Use `I` prefix for ports (e.g., `IUserRepository`, `IHasher`).
* **Use Cases:** Suffix with `UseCase` (e.g., `LoginUseCase`).
* **Entities:** Pure domain classes in `core/domain/entities`.
* **Repositories:** Implementation in `infra` should be specific (e.g., `TypeOrmUserRepository`).

## 3. Implementation Rules
* **Validation:** Input validation should happen at the API layer (DTOs), but domain rules must be enforced within Entities and Value Objects.
* **Mappers:** Use explicit mappers to convert between Infrastructure Entities (ORM) and Domain Entities.
* **Error Handling:** Use custom domain exceptions for business rule violations (e.g., `InvalidPasswordError`).
* **Transactions:** Ensure atomic operations for complex use cases like "Create Tenant + Admin User".

## 4. Security Standards
* **Hashing:** Never store plain-text passwords. Use `Bcrypt` or `Argon2`.
* **Tokens:** Use JWT for stateless authentication. Store refresh tokens in Redis with TTL.
* **Privacy:** Support data anonymization/deletion for GDPR/LGPD compliance.

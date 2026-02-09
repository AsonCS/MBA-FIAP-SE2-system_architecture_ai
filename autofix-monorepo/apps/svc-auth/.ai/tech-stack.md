# Technology Stack - svc-auth

## 1. Core Frameworks
* **Language:** TypeScript
* **Backend Framework:** NestJS
* **Architecture:** Clean Architecture + DDD

## 2. Persistence & Storage
* **Primary Database:** PostgreSQL (ACID compliance for user/tenant data).
* **Caching & Session:** Redis
    * Refresh Token storage (with TTL).
    * JWT Blocklist for forced logout.
    * Rate Limiting (Brute Force protection).

## 3. Communication & Integration
* **API:** REST (Express/Fastify via NestJS) and gRPC for inter-service communication.
* **Event Bus:** Kafka (Asynchronous notification for other services like `svc-notification`).

## 4. Security & Libraries
* **ORM:** TypeORM or Prisma.
* **Hashing:** Bcrypt or Argon2.
* **Authentication:** JWT (JSON Web Tokens).

## 5. Port Interfaces Example
```typescript
export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

export interface ITokenService {
  sign(payload: object): string;
  verify(token: string): object;
}
```

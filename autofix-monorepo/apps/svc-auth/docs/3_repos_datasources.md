# Repositórios e Data Sources

O serviço de autenticação exige alta consistência (ACID) e performance de leitura para validação de tokens.

## Contratos (Ports)
Definidos na camada `Core`, sem dependência de bibliotecas.

```typescript
// core/ports/IUserRepository.ts
export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
}

// core/ports/ITokenService.ts (Abstração JWT)
export interface ITokenService {
  sign(payload: object): string;
  verify(token: string): object;
}

```

## Data Sources & Implementação

1. **PostgreSQL (Principal):**
* Armazena `users`, `tenants`, `roles`, `permissions`.
* Uso de índices em `email` e `tenant_id`.


2. **Redis (Cache & Sessão):**
* **Refresh Tokens:** Armazenamento de Refresh Tokens com TTL (Time To Live).
* **Blocklist:** Armazena tokens JWT revogados antes da expiração (Logout forçado).
* **Rate Limiting:** Controle de tentativas de login falhas para evitar Brute Force.


3. **Kafka (Event Bus):**
* Canal de saída para notificar o sistema sobre novos cadastros.

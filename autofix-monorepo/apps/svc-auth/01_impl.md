# Guia de Implementação - svc-auth

Este documento descreve o plano técnico e as diretrizes para a implementação do microserviço `svc-auth`, servindo como ponte entre os requisitos de negócio e a arquitetura técnica.

## 1. Sequência de Desenvolvimento

Para respeitar a **Clean Architecture**, a implementação deve progredir da camada interna para a externa:

| Fase | Camada | Descrição |
|:--- |:--- |:--- |
| **1** | **Core/Domain** | Entidades, Agregados, Value Objects e Exceções de Domínio. |
| **2** | **Core/Ports** | Definição das interfaces (Contratos) para Repositórios e Serviços. |
| **3** | **Core/Application** | Casos de Uso (Logins, Cadastro de Tenant, etc). |
| **4** | **Infra/Adapters** | Implementações concretas (TypeORM, Redis, Kafka, Bcrypt). |
| **5** | **Infra/API** | Controllers NestJS, Guardiões de Rota e gRPC. |

---

## 2. Detalhes Técnicos de Implementação

### 2.1 Camada Core (Independente de Framework)

#### Entidades e Agregados (`src/core/domain`)
- **UserAggregate:** Raiz da identidade do usuário. Deve conter `Credentials` e `UserRole`.
- **TenantAggregate:** Representa a oficina. Deve garantir que cada Tenant nasça com um usuário de perfil `OWNER`.

#### Value Objects (`src/core/domain/value-objects`)
- **Email:** Garantir normalização (lowercase) e validação de regex.
- **Password:** Responsável por encapsular a lógica de comparação (`compare`) e garantir que nunca transite em texto simples após a criação.
- **CPF/CNPJ:** Implementar algoritmos de validação de documentos brasileiros.

#### Contratos (Ports) (`src/core/ports`)
- `IUserRepository`: Gerenciar persistência de usuários.
- `ITenantRepository`: Gerenciar persistência de organizações.
- `ITokenService`: Interface para `sign()` e `verify()` tokens JWT.
- `IHasher`: Interface para `hash()` e `compare()` de senhas.

### 2.2 Camada de Infraestrutura (Adapters)

#### Banco de Dados (`src/infra/database`)
- **PostgreSQL:** Utilizar TypeORM como ORM padrão.
- **Mappers:** Implementar mappers explícitos (ex: `UserMapper`) para isolar o domínio das entidades do banco de dados (decoradores do TypeORM).

#### Segurança e Criptografia (`src/infra/cryptography`)
- **Bcrypt:** Implementação padrão para o `IHasher`.
- **JWT:** Implementação do `ITokenService` com integração com o `@nestjs/jwt`.

#### Cache e Sessão (`src/infra/cache`)
- **Redis:** Utilizado para armazenamento de `RefreshTokens` (com TTL) e `Blocklist` de tokens revogados (Logout).

---

## 3. Lógica de Casos de Uso Críticos

### 3.1 Login (Authentication)
O `LoginUseCase` deve:
1. Buscar o usuário pelo email via `IUserRepository`.
2. Validar a senha via `IHasher`.
3. Gerar par de tokens (Access + Refresh).
4. Persistir o Refresh Token no Redis.
5. Retornar os tokens para o cliente.

### 3.2 Onboarding de Oficina (Tenant Creation)
O `CreateTenantUseCase` deve garantir a atomicidade:
1. Iniciar transação no banco de dados.
2. Criar e salvar a entidade `Tenant`.
3. Criar o usuário `Admin/Owner` associado ao `tenant_id`.
4. Salvar o usuário.
5. Confirmar (Commit) a transação.
6. Publicar eventos `TenantCreated` e `UserRegistered` no Kafka.

---

## 4. Padrões e Convenções

- **Erros de Domínio:** Nunca retornar códigos HTTP diretamente do Core. Lançar exceções como `InvalidEmailError` e capturá-las em um `GlobalExceptionFilter` na camada de Infra.
- **Validação de Entrada:** Utilizar `class-validator` nos DTOs da API, mas reforçar regras críticas dentro dos construtores das Entidades/VOs.
- **Nomenclatura:**
    - Interfaces: Prefixadas com `I` (`IUserRepository`).
    - Casos de Uso: Sufixados com `UseCase` (`LoginUseCase`).
    - Repositórios: Sufixados com a tecnologia (`TypeOrmUserRepository`).

---

## 5. Próximos Passos
1. Setup inicial do projeto NestJS com suporte a Monorepo.
2. Configuração do Docker Compose para PostgreSQL, Redis e Kafka.
3. Implementação do `UserAggregate` e `Email` VO.

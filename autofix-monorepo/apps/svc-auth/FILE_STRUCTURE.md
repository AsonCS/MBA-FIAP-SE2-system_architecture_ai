# Estrutura de Arquivos - svc-auth

```
svc-auth/
├── .ai/                                    # Documentação de arquitetura
│   ├── architecture.md
│   ├── business-rules.md
│   ├── standards.md
│   └── tech-stack.md
│
├── docs/                                   # Documentação adicional
│   ├── 1_estrutura_svc_auth.md
│   ├── 2_ddd_auth_elements.md
│   ├── 3_repos_datasources.md
│   ├── 4_historias_usuario.md
│   └── 5_fluxos_svc_auth.md
│
├── src/
│   ├── core/                              # ⭐ CORE - Framework Independent
│   │   ├── domain/                        # Camada de Domínio
│   │   │   ├── entities/
│   │   │   │   ├── user.aggregate.ts      # Agregado de Usuário
│   │   │   │   └── tenant.aggregate.ts    # Agregado de Tenant
│   │   │   ├── value-objects/
│   │   │   │   ├── email.vo.ts            # Email com validação
│   │   │   │   ├── password.vo.ts         # Password com hash
│   │   │   │   ├── cpf.vo.ts              # CPF com validação BR
│   │   │   │   ├── cnpj.vo.ts             # CNPJ com validação BR
│   │   │   │   └── user-role.vo.ts        # Enum de Roles
│   │   │   ├── events/
│   │   │   │   └── domain-events.ts       # Eventos de Domínio
│   │   │   └── exceptions/
│   │   │       └── domain-exceptions.ts   # Exceções de Domínio
│   │   │
│   │   ├── ports/                         # Interfaces (Contratos)
│   │   │   ├── user-repository.port.ts
│   │   │   ├── tenant-repository.port.ts
│   │   │   ├── refresh-token-repository.port.ts
│   │   │   ├── hasher.port.ts
│   │   │   ├── token-service.port.ts
│   │   │   └── event-publisher.port.ts
│   │   │
│   │   └── application/                   # Casos de Uso
│   │       ├── login.usecase.ts           # UC: Login
│   │       ├── create-tenant.usecase.ts   # UC: Criar Tenant
│   │       ├── refresh-token.usecase.ts   # UC: Refresh Token
│   │       └── logout.usecase.ts          # UC: Logout
│   │
│   ├── infra/                             # 🔧 INFRASTRUCTURE - Adapters
│   │   ├── database/                      # Persistência (TypeORM)
│   │   │   ├── entities/
│   │   │   │   ├── user.entity.ts         # ORM Entity
│   │   │   │   └── tenant.entity.ts       # ORM Entity
│   │   │   ├── mappers/
│   │   │   │   ├── user.mapper.ts         # Domain ↔ Persistence
│   │   │   │   └── tenant.mapper.ts       # Domain ↔ Persistence
│   │   │   └── repositories/
│   │   │       ├── typeorm-user.repository.ts
│   │   │       └── typeorm-tenant.repository.ts
│   │   │
│   │   ├── cryptography/                  # Segurança
│   │   │   ├── bcrypt-hasher.service.ts   # Implementação Bcrypt
│   │   │   └── jwt-token.service.ts       # Implementação JWT
│   │   │
│   │   ├── cache/                         # Redis
│   │   │   └── redis-refresh-token.repository.ts
│   │   │
│   │   ├── messaging/                     # Kafka
│   │   │   └── kafka-event-publisher.service.ts
│   │   │
│   │   └── api/                           # REST API (NestJS)
│   │       ├── controllers/
│   │       │   └── auth.controller.ts     # Endpoints REST
│   │       ├── dto/
│   │       │   ├── login.dto.ts
│   │       │   ├── create-tenant.dto.ts
│   │       │   └── refresh-token.dto.ts
│   │       ├── guards/
│   │       │   ├── jwt-auth.guard.ts      # Guard de Autenticação
│   │       │   └── jwt.strategy.ts        # Estratégia Passport
│   │       └── filters/
│   │           └── global-exception.filter.ts
│   │
│   ├── app.module.ts                      # Módulo Principal NestJS
│   └── main.ts                            # Entry Point
│
├── docker-compose.yml                     # Infraestrutura (PG, Redis, Kafka)
├── tsconfig.json                          # TypeScript Config
├── nest-cli.json                          # NestJS CLI Config
├── package.json                           # Dependencies & Scripts
├── .env                                   # Environment Variables
├── .env.example                           # Environment Template
├── .gitignore                             # Git Ignore
│
├── 01_impl.md                             # 📋 Guia de Implementação
├── README.md                              # 📖 Documentação Principal
├── IMPLEMENTATION_SUMMARY.md              # ✅ Resumo da Implementação
└── QUICKSTART.md                          # 🚀 Guia de Início Rápido
```

## 📊 Estatísticas

### Arquivos por Camada

| Camada | Arquivos | Descrição |
|--------|----------|-----------|
| **Core/Domain** | 7 | Entidades, VOs, Events, Exceptions |
| **Core/Ports** | 6 | Interfaces (Contratos) |
| **Core/Application** | 4 | Use Cases |
| **Infra/Database** | 6 | TypeORM Entities, Mappers, Repos |
| **Infra/Cryptography** | 2 | Bcrypt, JWT |
| **Infra/Cache** | 1 | Redis |
| **Infra/Messaging** | 1 | Kafka |
| **Infra/API** | 7 | Controllers, DTOs, Guards, Filters |
| **Config** | 2 | AppModule, Main |
| **Total** | **36** | Arquivos TypeScript |

### Linhas de Código (aproximado)

- **Core Layer**: ~800 linhas
- **Infrastructure Layer**: ~1200 linhas
- **Total**: ~2000 linhas

## 🎯 Princípios Arquiteturais

### Dependency Rule (Clean Architecture)

```
┌─────────────────────────────────────┐
│         Infra Layer                 │  ← Depende do Core
│  (Controllers, Repos, Services)     │
├─────────────────────────────────────┤
│         Core Layer                  │  ← Independente
│  (Domain, Ports, Application)       │
└─────────────────────────────────────┘
```

### Fluxo de Dependências

```
Controller → UseCase → Port ← Repository
    ↓           ↓              ↓
   DTO      Domain          ORM Entity
```

## 🔑 Arquivos Principais

### Core (Regras de Negócio)
- `user.aggregate.ts` - Lógica de usuário
- `tenant.aggregate.ts` - Lógica de tenant
- `*.vo.ts` - Validações de domínio
- `*.usecase.ts` - Orquestração de casos de uso

### Infrastructure (Implementação)
- `auth.controller.ts` - API REST
- `typeorm-*.repository.ts` - Persistência
- `bcrypt-hasher.service.ts` - Hashing
- `jwt-token.service.ts` - Tokens
- `kafka-event-publisher.service.ts` - Eventos

### Configuration
- `app.module.ts` - Dependency Injection
- `docker-compose.yml` - Infraestrutura local
- `.env` - Configurações

## 📝 Convenções de Nomenclatura

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Interface (Port) | `I{Nome}` | `IUserRepository` |
| Use Case | `{Nome}UseCase` | `LoginUseCase` |
| Repository | `{Tech}{Nome}Repository` | `TypeOrmUserRepository` |
| Value Object | `{Nome}.vo.ts` | `email.vo.ts` |
| Entity | `{Nome}.entity.ts` | `user.entity.ts` |
| Aggregate | `{Nome}.aggregate.ts` | `user.aggregate.ts` |
| DTO | `{Nome}.dto.ts` | `login.dto.ts` |
| Exception | `{Nome}Error` | `InvalidEmailError` |

## 🎨 Padrões de Design Utilizados

1. **Repository Pattern** - Abstração de persistência
2. **Dependency Injection** - Inversão de controle
3. **Strategy Pattern** - Passport JWT
4. **Factory Pattern** - Criação de Aggregates
5. **Mapper Pattern** - Domain ↔ Persistence
6. **Event-Driven** - Domain Events + Kafka
7. **Guard Pattern** - Proteção de rotas

---

**Legenda:**
- ⭐ = Framework Independent (Core)
- 🔧 = Framework Dependent (Infrastructure)
- 📋 = Documentação
- ✅ = Implementado
- 🔄 = Próximos passos

# svc-auth - Authentication & Authorization Microservice

Microserviço de autenticação e autorização para o sistema AutoFix, implementado seguindo os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**.

## 📋 Visão Geral

O `svc-auth` é responsável por:
- Gerenciamento de identidade e acesso (IAM)
- Multi-tenancy (suporte a múltiplas oficinas)
- Autenticação via JWT
- Gerenciamento de usuários e perfis
- Onboarding de novas oficinas

## 🏗️ Arquitetura

### Estrutura de Camadas

```
/src
├── /core                     # Framework Independent
│   ├── /domain
│   │   ├── /entities        # UserAggregate, TenantAggregate
│   │   ├── /value-objects   # Email, Password, CPF, CNPJ, UserRole
│   │   ├── /events          # Domain Events
│   │   └── /exceptions      # Domain Exceptions
│   ├── /ports               # Interfaces (Repositories, Services)
│   └── /application         # Use Cases
├── /infra                    # Adapters (NestJS)
│   ├── /database            # TypeORM Repositories & Mappers
│   ├── /cryptography        # Bcrypt, JWT
│   ├── /cache               # Redis
│   ├── /messaging           # Kafka
│   └── /api                 # Controllers, DTOs, Guards
└── /main.ts                 # Entry Point
```

### Princípios Aplicados

- **Clean Architecture**: Separação estrita entre lógica de negócio e infraestrutura
- **DDD**: Uso de Aggregates, Entities e Value Objects
- **Ports and Adapters**: Interfaces definidas no core, implementadas na infra
- **Dependency Inversion**: Core não depende de frameworks

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- Docker & Docker Compose
- npm ou yarn

### Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Inicie os serviços de infraestrutura:
```bash
npm run docker:up
```

### Executando

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## 📡 API Endpoints

### POST /auth/register
Registra uma nova oficina (tenant) com usuário administrador.

**Request:**
```json
{
  "tenantName": "Oficina ABC",
  "cnpj": "12345678901234",
  "ownerName": "João Silva",
  "ownerEmail": "joao@oficinaabc.com",
  "ownerPassword": "senha123"
}
```

### POST /auth/login
Autentica um usuário e retorna tokens JWT.

**Request:**
```json
{
  "email": "joao@oficinaabc.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "user_123",
    "email": "joao@oficinaabc.com",
    "name": "João Silva",
    "role": "OWNER",
    "tenantId": "tenant_456"
  }
}
```

### POST /auth/refresh
Renova o access token usando refresh token.

**Request:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

### POST /auth/logout
Revoga os tokens do usuário (requer autenticação).

## 🔐 Segurança

- Senhas hasheadas com **Bcrypt** (10 rounds)
- Tokens JWT com expiração (15min para access, 7 dias para refresh)
- Refresh tokens armazenados em Redis com TTL
- Blocklist de tokens revogados
- Validação de documentos brasileiros (CPF/CNPJ)

## 🗄️ Banco de Dados

### PostgreSQL

Tabelas principais:
- `tenants`: Oficinas/empresas
- `users`: Usuários do sistema

### Redis

Usado para:
- Armazenamento de refresh tokens
- Blocklist de tokens revogados
- Rate limiting (futuro)

### Kafka

Eventos publicados:
- `TenantCreated`: Quando uma nova oficina é criada
- `UserRegistered`: Quando um novo usuário é registrado
- `UserDeleted`: Quando um usuário é removido (GDPR)

## 🧪 Testes

```bash
# Unit tests
npm test

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 📦 Tecnologias

- **Framework**: NestJS
- **Language**: TypeScript
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Cache**: Redis (ioredis)
- **Messaging**: Kafka (kafkajs)
- **Authentication**: JWT (@nestjs/jwt, passport-jwt)
- **Hashing**: Bcrypt
- **Validation**: class-validator, class-transformer

## 🔄 Fluxos Principais

### Onboarding de Oficina

1. Validar CNPJ único
2. Validar email único
3. Criar Tenant (transação)
4. Criar usuário Owner
5. Commit da transação
6. Publicar eventos (TenantCreated, UserRegistered)

### Login

1. Buscar usuário por email
2. Verificar se está ativo
3. Validar senha (Bcrypt)
4. Gerar tokens JWT
5. Armazenar refresh token no Redis
6. Retornar tokens

## 📝 Convenções

- **Interfaces**: Prefixadas com `I` (`IUserRepository`)
- **Use Cases**: Sufixados com `UseCase` (`LoginUseCase`)
- **Repositórios**: Sufixados com tecnologia (`TypeOrmUserRepository`)
- **Exceções**: Sufixadas com `Error` (`InvalidEmailError`)

## 🤝 Contribuindo

1. Siga os princípios de Clean Architecture
2. Mantenha o core independente de frameworks
3. Use Value Objects para validações de domínio
4. Implemente testes unitários para casos de uso
5. Documente mudanças significativas

## 📄 Licença

ISC

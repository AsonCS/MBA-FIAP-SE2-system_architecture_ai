# Estrutura de Pastas e Arquitetura (API Gateway / BFF)

## Visão Geral
O API Gateway segue a **Clean Architecture** para garantir que a lógica de orquestração (Use Cases) não fique acoplada à forma como nos comunicamos com os microserviços (HTTP/gRPC/Kafka).

### Diagrama de Camadas

```mermaid
graph TD
    subgraph Drivers ["Framework & Drivers (NestJS)"]
        Controllers["REST Controllers (BFF Endpoints)"]
        Guards["Auth Guards & Interceptors"]
        ProxyModule["HTTP-Proxy Middleware"]
    end

    subgraph AppLayer ["Application Layer (Use Cases)"]
        Orchestrator["Orchestration Use Cases"]
        Transformers["Response Transformers (DTOMapper)"]
    end

    subgraph DomainLayer ["Domain Layer (Adapters Interfaces)"]
        Interfaces["IServiceInterfaces (Ports)"]
        Aggregates["Composite Entities"]
    end

    subgraph InfraLayer ["Infrastructure Layer"]
        ServiceProxies["Microservice Clients (Http/gRPC)"]
        Cache["Redis Cache Implementation"]
        CircuitBreaker["Resilience Policies"]
    end

    Controllers --> Orchestrator
    Orchestrator --> Interfaces
    Orchestrator --> Aggregates
    InfraLayer -- implements --> Interfaces

```

### Estrutura de Diretórios

A estrutura foca em módulos por funcionalidade do BFF (ex: Dashboard), não necessariamente espelhando 1:1 os microserviços.

```text
/src
├── /app                   # Configuração do NestJS (Modules, Middlewares)
├── /core                  # CAMADA DE DOMÍNIO DO BFF
│   ├── /domain
│   │   ├── /aggregates    # Objetos compostos (ex: DashboardData)
│   │   ├── /value-objects # VOs de apresentação (ex: FormattedCurrency)
│   │   └── /ports         # Interfaces para chamar microserviços (IServiceAdapter)
│   └── /use-cases         # Lógica de Agregação (ex: GetDashboardOverview)
├── /infra                 # IMPLEMENTAÇÃO TÉCNICA
│   ├── /http-client       # Configuração do Axios/gRPC
│   ├── /adapters          # Implementação dos Ports (ex: WorkOrderServiceAdapter)
│   ├── /cache             # Estratégias de Cache (Redis)
│   └── /observability     # Logging e Tracing (OpenTelemetry)
└── /interfaces            # PONTOS DE ENTRADA
    ├── /rest              # Controllers HTTP
    ├── /graphql           # Resolvers (se houver)
    └── /websockets        # Gateways para Realtime

```

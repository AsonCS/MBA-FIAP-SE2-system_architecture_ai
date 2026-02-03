# Fluxos Principais (Orquestração)

## Fluxo 1: Agregação de Dashboard (BFF Pattern)
Este fluxo mostra como o Gateway chama múltiplos serviços em paralelo para montar uma resposta rápida.

```mermaid
sequenceDiagram
    participant Client
    participant BFF as API Gateway (BFF)
    participant Auth as Svc Auth
    participant WO as Svc WorkOrder
    participant Inv as Svc Inventory
    participant Redis

    Client->>BFF: GET /dashboard
    
    rect rgb(240, 240, 240)
        note right of BFF: Verificação de Segurança
        BFF->>Redis: Check Blacklisted Token?
        Redis-->>BFF: OK
    end

    par Chamadas Paralelas
        BFF->>WO: Get Stats (Abertas, Fechadas)
        BFF->>Inv: Get Low Stock Items
        BFF->>Auth: Get User Profile & Avatar
    and
        WO-->>BFF: { open: 10, closed: 5 }
        Inv-->>BFF: [Item A, Item B]
        Auth-->>BFF: { name: "João", role: "Admin" }
    end

    note right of BFF: Consolidação (Merge)
    BFF->>BFF: Monta Objeto DashboardAggregate
    
    BFF-->>Client: JSON { stats, alerts, profile }

```

## Fluxo 2: Ingestão de Comando com Falha (Circuit Breaker)

Como o Gateway lida quando um microserviço está fora do ar.

```mermaid
sequenceDiagram
    participant Client
    participant BFF as API Gateway
    participant Svc as Svc WorkOrder

    Client->>BFF: POST /work-orders (Criar OS)
    
    BFF->>Svc: POST /internal/orders
    Svc--x BFF: 503 Service Unavailable (Timeout)
    
    Note over BFF: Circuit Breaker: Abre Circuito
    
    BFF-->>Client: 503 (Msg: "Sistema de OS instável, tente novamente")
    
    Client->>BFF: Retry imediato
    Note over BFF: Circuit Breaker: Fast Fail (Não chama Svc)
    BFF-->>Client: 503 (Fast Fail)

```

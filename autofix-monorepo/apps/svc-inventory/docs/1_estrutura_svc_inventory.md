# Estrutura de Pastas e Arquitetura (svc-inventory)

## Visão Geral
O serviço de estoque é focado em **Integridade de Dados** e **Controle de Concorrência**. A arquitetura deve prevenir "overselling" (vender o que não tem) e garantir rastreabilidade total (audit trail) de cada parafuso que entra ou sai.

### Diagrama de Camadas

```mermaid
graph TD
    subgraph Core ["Core Domain"]
        Aggregates["Product Aggregate"]
        VOs["Value Objects (SKU, Qty)"]
        Services["Domain Services (StockPolicy)"]
        Ports["Repository Interfaces"]
    end

    subgraph App ["Application Layer"]
        Commands["Inventory Commands"]
        Queries["Catalog Queries"]
        EventHandlers["Integration Event Handlers"]
    end

    subgraph Infra ["Infrastructure Layer"]
        DB["Postgres (Transactional)"]
        Cache["Redis (Catalog View)"]
        API["Controllers"]
        Kafka["Kafka Consumer"]
    end

    API --> Commands
    Kafka --> EventHandlers
    Commands --> Aggregates
    EventHandlers --> Services
    Infra -- implements --> Ports

```

### Estrutura de Diretórios

```text
/src
├── /core                  # LÓGICA DE NEGÓCIO
│   ├── /domain
│   │   ├── /aggregates    # Product (Raiz)
│   │   ├── /entities      # Supplier, StockMovement
│   │   ├── /value-objects # SKU, Money, Quantity
│   │   ├── /events        # LowStockDetected, StockAdjusted
│   │   └── /services      # StockReservationService
│   ├── /ports             # IProductRepository, ISupplierRepository
│   └── /application       # Use Cases
│       ├── /commands      # AdjustStock, RegisterProduct, ConsumeStock
│       └── /queries       # GetProductAvailability
├── /infra                 # IMPLEMENTAÇÃO
│   ├── /database          # TypeORM/Prisma
│   ├── /api               # REST (Gerenciamento)
│   └── /messaging         # Consumers (WorkOrderEvents)
└── /workers               # Jobs (ex: Relatório de Giro de Estoque)

```

# Fluxos Principais

## Fluxo 1: Adição de Item com Validação de Estoque (Síncrono)
Embora a baixa de estoque seja assíncrona na finalização, a verificação de disponibilidade deve ser síncrona no orçamento para evitar vender o que não tem.

```mermaid
sequenceDiagram
    participant API
    participant UC as AddItemUseCase
    participant Gateway as InventoryGateway
    participant Agg as WorkOrderAggregate
    participant Repo as WORepository
    participant SvcInv as Svc Inventory (Remoto)

    API->>UC: execute(osId, sku, qty)
    
    UC->>Gateway: checkAvailability(sku, qty)
    Gateway->>SvcInv: GET /products/{sku}/availability
    SvcInv-->>Gateway: { available: true, price: 100.00 }
    
    alt Estoque Indisponível
        Gateway-->>UC: false
        UC-->>API: Error (Item sem estoque)
    else Estoque Disponível
        UC->>Repo: findById(osId)
        Repo-->>UC: WorkOrder
        
        UC->>Agg: addItem(sku, qty, price)
        Agg->>Agg: recalculateTotal()
        
        UC->>Repo: save(WorkOrder)
        UC-->>API: Success (Item Added)
    end

```

## Fluxo 2: Finalização da Ordem de Serviço (Core Event Driven)

Este é o fluxo mais crítico, pois dispara efeitos colaterais em outros serviços.

```mermaid
sequenceDiagram
    participant Mecanico
    participant UC as FinishOrderUseCase
    participant Agg as WorkOrderAggregate
    participant Repo as WORepository
    participant Outbox as OutboxTable
    participant Kafka

    Mecanico->>UC: execute(osId)
    
    UC->>Repo: findById(osId)
    Repo-->>UC: WorkOrder
    
    UC->>Agg: finish()
    Note right of Agg: Valida: Todos itens conferidos?<br/>Valida: Pagamento OK? (Opcional)
    Agg->>Agg: status = COMPLETED
    
    Note right of UC: Transaction Start
    UC->>Repo: save(WorkOrder)
    UC->>Outbox: save(Event: OrderCompleted)
    Note right of UC: Transaction Commit
    
    UC-->>Mecanico: Success
    
    loop Background Worker
        Outbox->>Kafka: Publish "WorkOrder.Completed"
    end

```

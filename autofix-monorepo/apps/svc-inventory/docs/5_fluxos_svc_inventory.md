# Fluxos Principais

## Fluxo 1: Reserva de Estoque (Reativo a Evento)
Ocorre quando o cliente aprova o orçamento no `svc-work-order`. O estoque deve ser "segurado".

```mermaid
sequenceDiagram
    participant Kafka
    participant Handler as ReserveStockHandler
    participant Repo as ProductRepository
    participant Agg as ProductAggregate
    participant Redis

    Kafka->>Handler: Consome "WorkOrder.Approved"
    
    Handler->>Repo: findBySku(items.sku)
    Repo-->>Handler: Product (Version 10)
    
    Handler->>Agg: reserve(qty)
    Note right of Agg: available -= qty<br/>reserved += qty
    
    Handler->>Repo: save(Product, Version 10)
    
    alt Conflito de Versão (Optimistic Lock)
        Repo--x Handler: Error (Version Mismatch)
        Handler->>Handler: Retry (Recarrega e tenta de novo)
    else Sucesso
        Repo-->>Handler: OK
        Handler->>Redis: Update Cache (Novo Saldo)
    end

```

## Fluxo 2: Baixa Definitiva (Consumo)

Ocorre quando a O.S. é finalizada. Move de "Reservado" para "Baixado" e gera log de movimento.

```mermaid
sequenceDiagram
    participant Kafka
    participant Handler as ConsumeStockHandler
    participant RepoP as ProductRepo
    participant RepoM as MovementRepo

    Kafka->>Handler: Consome "WorkOrder.Completed"
    
    note right of Handler: Idempotência: Já processei este EventID?
    
    Handler->>RepoP: findBySku(sku)
    Handler->>Handler: product.confirmConsumption(qty)
    
    Handler->>Handler: Create Movement(Type: OUT, Ref: OS-123)
    
    par Transação DB
        Handler->>RepoP: update(product)
        Handler->>RepoM: save(movement)
    end
    
    Handler-->>Kafka: Ack

```

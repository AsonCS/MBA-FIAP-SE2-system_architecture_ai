# Repositórios e Data Sources

## Concorrência e Locking
O maior desafio do estoque é a concorrência (duas O.S. tentando reservar a última peça).
Utilizamos **Optimistic Locking** (Versionamento) no banco de dados.

### Interfaces (Ports)
```typescript
interface IProductRepository {
  findBySku(sku: string): Promise<Product>;
  save(product: Product, version: number): Promise<void>; // Falha se versão mudou
}

interface IMovementRepository {
  log(movement: StockMovement): Promise<void>;
}

```

## Data Sources

1. **PostgreSQL (Transactional):**
* Tabelas: `products`, `movements`, `suppliers`.
* Constraint: `check (available_stock >= 0)`. O banco é a última barreira contra estoque negativo.


2. **Redis (Read-Model / Cache):**
* Armazena uma projeção leve do catálogo (`SKU -> { price, available }`).
* Atualizado via evento sempre que o Postgres muda (Pattern: Look-aside ou Write-through).
* Permite que o `svc-work-order` consulte disponibilidade extremamente rápido sem bater no Postgres principal.


3. **Kafka (Input):**
* Tópico: `work-order.events`
* Grupo de Consumo: `inventory-group`

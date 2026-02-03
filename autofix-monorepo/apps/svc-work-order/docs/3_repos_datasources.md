# Repositórios e Data Sources

## Interfaces (Ports - Core)
O domínio define como ele quer acessar os dados.

```typescript
// core/ports/IWorkOrderRepository.ts
export interface IWorkOrderRepository {
  save(workOrder: WorkOrder): Promise<void>;
  findById(id: string): Promise<WorkOrder | null>;
  findByVehicle(plate: string): Promise<WorkOrder[]>;
}

// core/ports/IInventoryGateway.ts (ACL)
export interface IInventoryGateway {
  checkAvailability(sku: string, quantity: number): Promise<boolean>;
  reserveStock(sku: string, quantity: number): Promise<void>;
}

```

## Implementação (Infra)

1. **Database Relacional (PostgreSQL):**
* Schema robusto para garantir integridade referencial entre O.S. e Itens.
* Uso de JSONB para armazenar os Snapshots (`customer` e `vehicle`) para evitar JOINS complexos inter-serviços.


2. **Anti-Corruption Layer (ACL):**
* O `InventoryGateway` traduz chamadas de método do domínio em requisições HTTP/gRPC para o `svc-inventory`.


3. **Outbox Pattern (Confiabilidade de Eventos):**
* Para garantir que o evento `WorkOrder.Completed` seja enviado ao Kafka mesmo se o banco cair logo após o commit, salvamos o evento em uma tabela `outbox` no mesmo banco da O.S. e um *worker* lê e publica no Kafka.

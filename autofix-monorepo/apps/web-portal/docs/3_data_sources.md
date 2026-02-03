# Repositórios e Data Sources

A camada de infraestrutura é responsável por buscar dados e entregá-los ao domínio no formato correto (Mappers).

## Padrão Repository
O componente React nunca chama o `axios.get` diretamente. Ele chama um método de um caso de uso, que chama o repositório.

### Interfaces (Core)
```typescript
interface IWorkOrderRepository {
  getById(id: string): Promise<WorkOrder>;
  save(order: WorkOrder): Promise<void>;
  list(filter: WorkOrderFilter): Promise<WorkOrder[]>;
}
```

### Implementação (Infra)
```typescript
class ApiWorkOrderRepository implements IWorkOrderRepository {
  constructor(private httpClient: HttpClient) {}

  async getById(id: string): Promise<WorkOrder> {
    const json = await this.httpClient.get(`/work-orders/${id}`);
    return WorkOrderMapper.toDomain(json); // Converte DTO para Entidade
  }
}
```

## Data Sources

1. **REST API (Backend):** Fonte primária de verdade.
2. **Next.js API Routes (Server Side):** Utilizado como proxy seguro ou para agregação de dados simples.
3. **Local Storage / IndexedDB:** Utilizado para persistência de rascunhos de O.S. (Offline-first approach) e preferências do usuário.

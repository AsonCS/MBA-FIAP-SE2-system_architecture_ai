# Repositórios e Adaptadores (Service Proxies)

No Gateway, não acessamos Banco de Dados diretamente. Nossos "Repositórios" são adaptadores que comunicam com os Microserviços via HTTP (REST) ou gRPC.

## Padrão Adapter (Anti-Corruption Layer)
Protege o BFF de mudanças nas APIs dos microserviços. Se a API do microserviço mudar, alteramos apenas o adaptador, não o Use Case.

### Interface (Port - Core Layer)
```typescript
// core/domain/ports/IWorkOrderService.ts
export interface IWorkOrderService {
  getRecentOrders(tenantId: string, limit: number): Promise<WorkOrderSummary[]>;
  createOrder(data: CreateOrderInput): Promise<string>; // Retorna UUID
}

```

### Implementação (Adapter - Infra Layer)

Usa **Circuit Breaker** para evitar falhas em cascata.

```typescript
// infra/adapters/HttpWorkOrderService.ts
@Injectable()
export class HttpWorkOrderService implements IWorkOrderService {
  constructor(private http: HttpService) {}

  @UseCircuitBreaker({ failures: 3, timeout: 1000 })
  async getRecentOrders(tenantId: string, limit: number): Promise<WorkOrderSummary[]> {
    const response = await this.http.get(
      `${process.env.SVC_WO_URL}/orders?limit=${limit}`,
      { headers: { 'X-Tenant-ID': tenantId } }
    );
    return response.data.map(mapToSummary);
  }
}

```

## Data Sources

1. **Microserviços Upstream:** Fonte da verdade.
2. **Redis (Cache):** Armazena agregações pesadas (ex: catálogo de produtos) com TTL curto.
3. **Config Service:** Gerencia feature flags e URLs dos serviços.

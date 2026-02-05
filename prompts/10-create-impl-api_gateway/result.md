# Guia de Implementação: API Gateway (BFF)

Este guia descreve o passo a passo para a implementação do API Gateway utilizando NestJS e Clean Architecture, conforme definido na documentação de arquitetura.

## Pré-requisitos
- Node.js (v18+)
- NestJS CLI (`npm i -g @nestjs/cli`)
- Acesso ao monorepo (pasta `autofix-monorepo`)

---

## Passo 1: Inicialização do Projeto
Criação da aplicação NestJS dentro do monorepo (caso não exista) ou limpeza da estrutura padrão.

**Comando:**
```bash
# Na raiz do monorepo
cd apps
nest new api-gateway --skip-git --package-manager npm
# Remova arquivos padrão desnecessários (app.controller.ts, app.service.ts)
rm api-gateway/src/app.controller.* api-gateway/src/app.service.*
```

---

## Passo 2: Definição da Estrutura de Pastas
Criação da estrutura de diretórios seguindo o padrão de arquitetura definido em `1_estrutura_gateway.md`.

**Ação:**
Dentro de `apps/api-gateway/src`, criar as seguintes pastas:

```text
src/
├── app/              # Configurações do Framework
├── core/             # Regras de Negócio e Interfaces
│   ├── domain/
│   │   ├── aggregates
│   │   ├── value-objects
│   │   └── ports     # Interfaces (Ports)
│   └── use-cases
├── infra/            # Implementações (Adapters)
│   ├── http-client
│   ├── adapters
│   └── config
└── interfaces/       # Pontos de Entrada
    └── rest
```

---

## Passo 3: Implementação da Camada Core (Domain Ports)
Definir as interfaces que o Gateway utilizará para se comunicar com os microserviços. Isso desacopla o Gateway da implementação HTTP/gRPC específica.

**Exemplo:** Porta para o Serviço de Ordens de Serviço (Work Orders).

**Arquivo:** `src/core/domain/ports/IWorkOrderService.ts`
```typescript
export interface WorkOrderSummary {
  id: string;
  status: string;
  vehicle: string;
}

export abstract class IWorkOrderService {
  abstract getRecentOrders(tenantId: string, limit: number): Promise<WorkOrderSummary[]>;
  abstract createOrder(data: any): Promise<string>;
}
```

---

## Passo 4: Implementação da Camada Infra (Adapters)
Implementar os adaptadores que realizam as chamadas HTTP reais. Aqui usamos o `HttpService` do NestJS (Axios).

**Dependências necessárias:**
```bash
npm install @nestjs/axios axios
```

**Arquivo:** `src/infra/adapters/HttpWorkOrderService.ts`
```typescript
import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { IWorkOrderService, WorkOrderSummary } from '../../core/domain/ports/IWorkOrderService';

@Injectable()
export class HttpWorkOrderService implements IWorkOrderService {
  constructor(private readonly httpService: HttpService) {}

  async getRecentOrders(tenantId: string, limit: number): Promise<WorkOrderSummary[]> {
    try {
        // URL deve vir de variáveis de ambiente
        const url = `${process.env.SVC_WORK_ORDER_URL}/orders?limit=${limit}`;
        const response = await lastValueFrom(
            this.httpService.get(url, { headers: { 'X-Tenant-ID': tenantId } })
        );
        return response.data; // Mapear se necessário
    } catch (error) {
        throw new HttpException('Falha ao comunicar com WorkOrder Service', 503);
    }
  }

  async createOrder(data: any): Promise<string> {
    // Implementar POST...
    return 'uuid-mock';
  }
}
```

---

## Passo 5: Implementação da Camada Core (Use Cases & Aggregates)
Criar a lógica de orquestração que agrega dados de múltiplos serviços. Exemplo do Dashboard.

**Arquivo:** `src/core/use-cases/GetDashboardOverview.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { IWorkOrderService } from '../domain/ports/IWorkOrderService';

// Agregado simples para o exemplo
export interface DashboardAggregate {
  recentOrders: any[];
  timestamp: Date;
}

@Injectable()
export class GetDashboardOverview {
  constructor(
    private readonly workOrderService: IWorkOrderService
    // Injetar outros serviços aqui (Inventory, Notification, etc)
  ) {}

  async execute(tenantId: string): Promise<DashboardAggregate> {
    // Chamada ao serviço via Porta
    const orders = await this.workOrderService.getRecentOrders(tenantId, 5);

    // Aqui faríamos Promise.all se tivéssemos outros serviços
    
    return {
      recentOrders: orders,
      timestamp: new Date(),
    };
  }
}
```

---

## Passo 6: Implementação da Camada de Interface (Controllers)
Criar os Endpoints REST que recebem a requisição e chamam os Use Cases.

**Arquivo:** `src/interfaces/rest/dashboard.controller.ts`
```typescript
import { Controller, Get, Headers } from '@nestjs/common';
import { GetDashboardOverview } from '../../core/use-cases/GetDashboardOverview';

@Controller('api/v1/dashboard')
export class DashboardController {
  constructor(private readonly getDashboardUseCase: GetDashboardOverview) {}

  @Get()
  async getDashboard(@Headers('x-tenant-id') tenantId: string) {
    return this.getDashboardUseCase.execute(tenantId);
  }
}
```

---

## Passo 7: Configuração de Dependências (Wiring)
Configurar o Módulo do NestJS para ligar a Interface Abstrata (`IWorkOrderService`) à Implementação Concreta (`HttpWorkOrderService`).

**Arquivo:** `src/app/app.module.ts` (ou um módulo específico como `DashboardModule`)
```typescript
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DashboardController } from '../interfaces/rest/dashboard.controller';
import { GetDashboardOverview } from '../core/use-cases/GetDashboardOverview';
import { IWorkOrderService } from '../core/domain/ports/IWorkOrderService';
import { HttpWorkOrderService } from '../infra/adapters/HttpWorkOrderService';

@Module({
  imports: [HttpModule],
  controllers: [DashboardController],
  providers: [
    GetDashboardOverview,
    {
      provide: IWorkOrderService, // Quando alguém pedir IWorkOrderService...
      useClass: HttpWorkOrderService, // ...entregue HttpWorkOrderService
    },
  ],
})
export class AppModule {}
```

---

## Passo 8: Variáveis de Ambiente
Configurar as URLs dos microserviços.

**Arquivo:** `.env`
```env
SVC_WORK_ORDER_URL=http://localhost:3001
SVC_INVENTORY_URL=http://localhost:3002
```

## Resumo da Checklist
1. [ ] Inicializar projeto NestJS
2. [ ] Criar estrutura de pastas (Core, Infra, Interfaces)
3. [ ] Criar Interface (Port) do serviço externo
4. [ ] Implementar Adapter HTTP usando Axios
5. [ ] Criar Use Case para orquestrar a chamada
6. [ ] Criar Controller
7. [ ] Configurar Injeção de Dependência no Module
8. [ ] Testar fluxo

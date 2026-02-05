# Guia de Implementação: API Gateway (BFF) + TDD & Swagger

Este guia descreve o passo a passo para a implementação do API Gateway utilizando **NestJS**, **Clean Architecture** e **TDD (Test Driven Development)**.

## Pré-requisitos
- Node.js (v18+)
- NestJS CLI (`npm i -g @nestjs/cli`)
- Acesso ao monorepo (pasta `autofix-monorepo`)

---

## Passo 1: Inicialização e Configuração (Swagger)
Criação da aplicação e configuração da documentação automática.

**Comando:**
```bash
# Na raiz do monorepo
cd apps
nest new api-gateway --skip-git --package-manager npm
cd api-gateway
npm install @nestjs/swagger swagger-ui-express
# Limpeza inicial
rm src/app.controller.* src/app.service.*
```

**Ação:** Configurar Swagger em `src/main.ts`.

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('AutoFix API Gateway')
    .setDescription('BFF para agregação de serviços da AutoFix')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();
```

---

## Passo 2: Definição da Estrutura de Pastas
Criação da estrutura de diretórios seguindo a Clean Architecture.

**Ação:**
Dentro de `src/`, criar as seguintes pastas:

```text
src/
├── app/              # Configurações do Framework
├── core/             # Regras de Negócio
│   ├── domain/
│   │   ├── ports     # Interfaces (Ports)
│   └── use-cases     # Lógica de Aplicação
├── infra/            # Implementações (Adapters)
│   ├── managers      # Adapters HTTP/gRPC
└── interfaces/       # Pontos de Entrada
    └── rest          # Controllers
```

---

## Passo 3: Definição de Contratos (Ports)
Antes de testar ou implementar, definimos as interfaces.

**Arquivo:** `src/core/domain/ports/IWorkOrderService.ts`
```typescript
export interface WorkOrderSummary {
  id: string;
  status: string;
}

export abstract class IWorkOrderService {
  abstract getRecentOrders(tenantId: string, limit: number): Promise<WorkOrderSummary[]>;
}
```

---

## Passo 4: TDD - Teste Unitário do Use Case (RED Phase)
Seguindo o TDD, criamos o teste **antes** da implementação da lógica. Mockamos a dependência (`IWorkOrderService`).

**Arquivo:** `src/core/use-cases/GetDashboardOverview.spec.ts`
```typescript
import { GetDashboardOverview } from './GetDashboardOverview';
import { IWorkOrderService } from '../domain/ports/IWorkOrderService';

describe('GetDashboardOverview', () => {
  let useCase: GetDashboardOverview;
  let workOrderService: IWorkOrderService;

  beforeEach(() => {
    // Mock simples da interface
    workOrderService = {
      getRecentOrders: jest.fn().mockResolvedValue([{ id: '1', status: 'OPEN' }]),
    } as any;
    useCase = new GetDashboardOverview(workOrderService);
  });

  it('deve retornar dados agregados do dashboard', async () => {
    const result = await useCase.execute('tenant-1');
    expect(result.recentOrders).toHaveLength(1);
    expect(result.timestamp).toBeDefined();
    expect(workOrderService.getRecentOrders).toHaveBeenCalledWith('tenant-1', 5);
  });
});
```

**Validar:** Rode `npm run test` e veja o teste falhar (pois o arquivo da classe ainda não existe ou está vazio).

---

## Passo 5: Implementação do Use Case (GREEN Phase)
Agora implementamos o código necessário para passar no teste.

**Arquivo:** `src/core/use-cases/GetDashboardOverview.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { IWorkOrderService } from '../domain/ports/IWorkOrderService';

export interface DashboardAggregate {
  recentOrders: any[];
  timestamp: Date;
}

@Injectable()
export class GetDashboardOverview {
  constructor(private readonly workOrderService: IWorkOrderService) {}

  async execute(tenantId: string): Promise<DashboardAggregate> {
    const orders = await this.workOrderService.getRecentOrders(tenantId, 5);
    return {
      recentOrders: orders,
      timestamp: new Date(), // Lógica simples para passar no teste
    };
  }
}
```

---

## Passo 6: TDD - Teste de Integração do Controller
Testamos se o Controller chama o Use Case corretamente e retorna o status HTTP esperado.

**Arquivo:** `src/interfaces/rest/dashboard.controller.spec.ts`
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { GetDashboardOverview } from '../../core/use-cases/GetDashboardOverview';

describe('DashboardController', () => {
  let controller: DashboardController;
  let useCase: GetDashboardOverview;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: GetDashboardOverview,
          useValue: { execute: jest.fn().mockResolvedValue({ recentOrders: [] }) },
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    useCase = module.get<GetDashboardOverview>(GetDashboardOverview);
  });

  it('deve chamar o use case com o tenant header', async () => {
    await controller.getDashboard('tenant-123');
    expect(useCase.execute).toHaveBeenCalledWith('tenant-123');
  });
});
```

---

## Passo 7: Implementação do Controller (Com Swagger)
Implementar o Controller e decorar com tags do Swagger.

**Arquivo:** `src/interfaces/rest/dashboard.controller.ts`
```typescript
import { Controller, Get, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { GetDashboardOverview } from '../../core/use-cases/GetDashboardOverview';

@ApiTags('Dashboard')
@Controller('api/v1/dashboard')
export class DashboardController {
  constructor(private readonly useCase: GetDashboardOverview) {}

  @Get()
  @ApiOperation({ summary: 'Obtém visão geral do dashboard' })
  @ApiHeader({ name: 'x-tenant-id', description: 'ID do Tenant' })
  async getDashboard(@Headers('x-tenant-id') tenantId: string) {
    return this.useCase.execute(tenantId);
  }
}
```

---

## Passo 8: Implementação do Adapter (Infra)
Implementação da chamada HTTP real.

**Arquivo:** `src/infra/adapters/HttpWorkOrderService.ts`
```typescript
import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'; // Necessita `npm i @nestjs/axios axios`
import { lastValueFrom } from 'rxjs';
import { IWorkOrderService, WorkOrderSummary } from '../../core/domain/ports/IWorkOrderService';

@Injectable()
export class HttpWorkOrderService implements IWorkOrderService {
  constructor(private readonly httpService: HttpService) {}

  async getRecentOrders(tenantId: string, limit: number): Promise<WorkOrderSummary[]> {
    try {
        const url = `${process.env.SVC_WORK_ORDER_URL}/orders`;
        const { data } = await lastValueFrom(
            this.httpService.get(url, { 
                params: { limit },
                headers: { 'X-Tenant-ID': tenantId } 
            })
        );
        return data; 
    } catch (e) {
        throw new HttpException('Erro de comunicação', 503);
    }
  }
}
```

---

## Passo 9: Wiring (Injeção de Dependência)
Conectar tudo no módulo principal.

**Arquivo:** `src/app/app.module.ts`
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
    { provide: IWorkOrderService, useClass: HttpWorkOrderService },
  ],
})
export class AppModule {}
```

---

## Passo 10: Testes E2E (End-to-End)
Verifica o fluxo completo (Request -> Controller -> UseCase -> Mock Adapter -> Response).

**Arquivo:** `test/dashboard.e2e-spec.ts`
```typescript
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app/app.module'; // Ajuste o path conforme necessário
import { IWorkOrderService } from '../src/core/domain/ports/IWorkOrderService';

describe('Dashboard (e2e)', () => {
  let app;
  const workOrderServiceMock = { getRecentOrders: () => [{ id: 'TESTE' }] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(IWorkOrderService) // Mockamos apenas a borda externa
      .useValue(workOrderServiceMock)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/GET dashboard', () => {
    return request(app.getHttpServer())
      .get('/api/v1/dashboard')
      .set('x-tenant-id', 'tenant-1')
      .expect(200)
      .expect((res) => {
        expect(res.body.recentOrders[0].id).toBe('TESTE');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

## Resumo da Checklist
1. [ ] Inicializar projeto e Instalar Swagger
2. [ ] Configurar `main.ts` com Swagger
3. [ ] Criar estrutura de pastas
4. [ ] Definir Interface (Port)
5. [ ] **TDD:** Criar Teste Unitário do Use Case (FALHA)
6. [ ] Implementar Use Case (PASSA)
7. [ ] **TDD:** Criar Teste do Controller (Integração)
8. [ ] Implementar Controller com Decorators Swagger
9. [ ] Implementar Adapter HTTP
10. [ ] Configurar Módulo (DI)
11. [ ] Criar e Rodar Teste E2E

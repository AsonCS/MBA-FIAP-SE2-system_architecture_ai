# Work Order Service (svc-work-order)

Microserviço responsável pela gestão completa do ciclo de vida das Ordens de Serviço (O.S.) no sistema AutoFix.

## 📋 Visão Geral

O `svc-work-order` gerencia todo o processo de ordens de serviço, desde a criação do rascunho até a finalização, incluindo:

- Criação e gerenciamento de ordens de serviço
- Adição de peças e serviços
- Validação síncrona de estoque
- Cálculo automático de totais
- Máquina de estados para controle de status
- Integração com inventário via ACL
- Publicação de eventos via Outbox Pattern

## 🏗️ Arquitetura

Este serviço segue os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**:

```
/src
├── /core                    # Lógica de Negócio (Framework Independent)
│   ├── /domain
│   │   ├── /aggregates      # WorkOrder (Root)
│   │   ├── /entities        # OrderItem, PartItem, ServiceItem
│   │   ├── /value-objects   # Money, WorkOrderStatus, Snapshots
│   │   ├── /events          # Domain Events
│   │   ├── /services        # TaxCalculator, ProfitMarginService
│   │   └── /exceptions      # Domain Exceptions
│   ├── /ports               # Interfaces (Repository, Gateways)
│   └── /application         # Use Cases (Commands/Queries)
├── /infra                   # Implementação Técnica (NestJS)
│   ├── /database            # TypeORM Entities & Repositories
│   ├── /http                # REST Controllers
│   ├── /adapters            # ACL, Event Publishers
│   └── /workers             # Outbox Worker
└── /shared                  # Utilitários
```

## 🚀 Tecnologias

- **Framework**: NestJS
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL (com JSONB para snapshots)
- **Mensageria**: Kafka
- **ORM**: TypeORM
- **Documentação**: Swagger/OpenAPI

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Configurar variáveis de ambiente
# Edite o arquivo .env com suas configurações
```

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Application
NODE_ENV=development
PORT=3003

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=work_order_db

# Kafka
KAFKA_BROKERS=localhost:9092
KAFKA_TOPIC_PREFIX=autofix

# External Services
INVENTORY_SERVICE_URL=http://localhost:3002
```

## 🏃 Execução

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start

# Debug
npm run start:debug
```

## 📚 API Documentation

Após iniciar o serviço, acesse a documentação Swagger em:
```
http://localhost:3003/api/docs
```

## 🔑 Principais Funcionalidades

### 1. Criação de Ordem de Serviço
```http
POST /api/work-orders
```

### 2. Adicionar Peça
```http
POST /api/work-orders/:id/items/parts
```

### 3. Adicionar Serviço
```http
POST /api/work-orders/:id/items/services
```

### 4. Finalizar Ordem de Serviço
```http
PATCH /api/work-orders/:id/complete
```

### 5. Listar Ordens de Serviço
```http
GET /api/work-orders
```

### 6. Buscar Ordem de Serviço
```http
GET /api/work-orders/:id
```

## 🔄 Fluxo de Status

```
DRAFT → PENDING_APPROVAL → APPROVED → IN_PROGRESS → COMPLETED
                                                   ↓
                                               CANCELED
```

## 🎯 Padrões Implementados

### 1. **Outbox Pattern**
- Garante publicação confiável de eventos
- Worker em background processa mensagens pendentes
- Retry automático com limite de tentativas

### 2. **Anti-Corruption Layer (ACL)**
- Integração com `svc-inventory` via HTTP
- Tradução de modelos externos para domínio interno

### 3. **Snapshots**
- Dados de cliente e veículo armazenados como JSONB
- Preserva histórico mesmo se dados originais mudarem

### 4. **State Machine**
- Transições de status validadas
- Impede mudanças inválidas de estado

### 5. **Money Value Object**
- Cálculos financeiros em centavos (inteiros)
- Evita erros de ponto flutuante

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes com cobertura
npm run test:cov

# Testes em modo watch
npm run test:watch
```

## 📊 Eventos Publicados

- `WorkOrder.Created` - Quando uma O.S. é criada
- `WorkOrder.ItemAdded` - Quando um item é adicionado
- `WorkOrder.StatusChanged` - Quando o status muda
- `WorkOrder.Completed` - Quando a O.S. é finalizada (dispara baixa de estoque)

## 🔗 Integrações

### Serviços Consumidos
- **svc-inventory**: Verificação de estoque e reservas

### Serviços que Consomem
- **svc-inventory**: Recebe eventos de conclusão para baixa de estoque
- **svc-notification**: Pode receber eventos para notificações

## 📝 Regras de Negócio

1. **Multi-tenancy**: Todas as operações são isoladas por `tenantId`
2. **Validação de Estoque**: Peças são validadas sincronamente antes de adicionar
3. **Recálculo Automático**: Totais são recalculados a cada mudança de itens
4. **Imutabilidade de Snapshots**: Dados históricos não mudam
5. **Transacionalidade**: Finalização usa transação única para O.S. + Outbox

## 🛠️ Desenvolvimento

### Estrutura de Commits
```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
refactor: refatora código
test: adiciona testes
```

### Code Style
- ESLint configurado
- Prettier para formatação
- Seguir princípios SOLID

## 📄 Licença

Propriedade da AutoFix SaaS

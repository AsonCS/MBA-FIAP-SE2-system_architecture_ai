# Guia de Implementação - svc-inventory

Este documento detalha o plano técnico e as diretrizes para a execução do microserviço `svc-inventory`, que é responsável pelo controle de peças, reserva de estoque e rastreabilidade total de movimentações.

## 1. Sequência de Desenvolvimento

Seguindo a **Clean Architecture** e o padrão **CQRS**, a implementação deve seguir as seguintes fases:

| Fase | Camada | Descrição |
|:--- |:--- |:--- |
| **1** | **Core/Domain** | Agregado `Product`, VOs (`SKU`, `Quantity`), e Serviços de Domínio. |
| **2** | **Core/Ports** | Interfaces de Repositório (`IProductRepository`) e Mensageria. |
| **3** | **Core/Application** | Implementação de Commands (Escrita: `AdjustStock`) e Queries (Leitura: `GetProductAvailability`). |
| **4** | **Infra/Adapters** | Implementação TypeORM com **Optimistic Locking**, Redis para cache de leitura e Kafka Consumers. |
| **5** | **Infra/API** | Controllers REST para gestão administrativa e gRPC para consultas internas rápidas. |

---

## 2. Detalhes Técnicos de Implementação

### 2.1 Camada Core (Logica de Negócio)

#### Agregado Principal (`src/core/domain/aggregates`)
- **Product:** Raiz de consistência para níveis de estoque. Deve conter lógica para `reserve`, `confirmConsumption` e `addStock`.
- **Integridade:** Garantir que `availableStock` nunca seja negativo através do VO `Quantity` e regras de negócio no Agregado.

#### Value Objects (`src/core/domain/value-objects`)
- **SKU:** Identificador único de negócio (ex: `OIL-FIL-001`).
- **Quantity:** Encapsula lógica aritmética e validações (não aceita negativos).
- **Money:** Para gestão de custo médio e preço de venda.

#### Contratos (Ports) (`src/core/ports`)
- `IProductRepository`: Deve incluir suporte a versionamento para o locking otimista.
- `IMovementRepository`: Para persistência imutável do histórico (Kardex).

### 2.2 Camada de Infraestrutura (Adapters)

#### Persistência e Concorrência (`src/infra/database`)
- **Optimistic Locking:** Utilizar coluna de `version` na tabela `products`. O comando `save` deve falhar se a versão no banco for diferente da versão carregada.
- **Transactions:** Operações de baixa de estoque devem persistir o `Product` e o `StockMovement` de forma atômica.

#### Cache de Leitura (`src/infra/cache`)
- **Redis:** Implementar projeções do catálogo (`SKU` -> `Basic Info`) para consultas de alta performance pelo `svc-work-order`.

#### Mensageria (`src/infra/messaging`)
- **Kafka Consumers:** Implementar handlers para `WorkOrder.Approved` (reserva) e `WorkOrder.Completed` (baixa definitiva).
- **Idempotência:** Garantir que o processamento de eventos seja idêntico se recebido em duplicidade.

---

## 3. Lógica de Casos de Uso Críticos

### 3.1 Reserva de Estoque (Reativo)
1. Consumir `WorkOrder.Approved`.
2. Carregar `Product` pelo SKU.
3. Executar `product.reserve(qty)`.
4. Salvar com verificação de versão (Retry em caso de conflito).
5. Atualizar cache no Redis.

### 3.2 Consumo de Estoque (Baixa)
1. Consumir `WorkOrder.Completed`.
2. Executar `product.confirmConsumption(qty)`.
3. Criar log de `StockMovement` (Tipo: OUT, Motivo: WORK_ORDER).
4. Persistir em transação única.

---

## 4. Padrões e Convenções

- **CQRS:** Manter separação clara entre modelos de escrita (Agregados DDD) e modelos de leitura (Projeções Redis/DTOs).
- **Imutabilidade:** O histórico de movimentações (`StockMovement`) nunca deve ser editado ou excluído.
- **Tratamento de Erros:** Exceções como `InsufficientStockError` devem ser lançadas no Core e convertidas em códigos apropriados (ex: 409 Conflict ou 422 Unprocessable Entity) na API.
- **Nomenclatura:**
    - Commands: `AdjustStockCommand`, `ReserveStockCommand`.
    - Queries: `GetProductDetailsQuery`.
    - Repositórios: `TypeOrmProductRepository`.

---

## 5. Próximos Passos
1. Setup do projeto NestJS no monorepo para `svc-inventory`.
2. Migrações de banco de dados para `products` e `movements` (com suporte a `version`).
3. Implementação do Agregado `Product` e testes unitários da lógica de reserva.

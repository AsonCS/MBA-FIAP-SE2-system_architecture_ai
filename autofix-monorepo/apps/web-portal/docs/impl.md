# Guia de Implementação - web-portal

Este documento descreve o plano técnico e as diretrizes para a implementação do microserviço `web-portal`, utilizando Next.js com os princípios da **Clean Architecture** e **Atomic Design**.

## 1. Sequência de Desenvolvimento

Para garantir o desacoplamento proposto pela Clean Architecture, o desenvolvimento deve seguir esta ordem:

| Fase | Camada | Descrição |
|:--- |:--- |:--- |
| **1** | **Design System** | Implementação dos componentes base (`atoms`, `molecules`) seguindo o Atomic Design. |
| **2** | **Core (Domain)** | Definição de Entidades (`WorkOrder`), Value Objects (`Money`, `CPF`) e Interfaces (Ports). |
| **3** | **Core (Use Cases)** | Lógica de aplicação (ex: `CreateWorkOrderUseCase`, `ApproveOrderUseCase`). |
| **4** | **Infraestrutura** | Implementação de Repositórios concretos, Clientes HTTP (Axios) e Mappers. |
| **5** | **Apresentação** | Desenvolvimento de Hooks (Controllers), Contextos e Páginas do Next.js. |

---

## 2. Detalhes Técnicos de Implementação

### 2.1 Camada Core (Regras de Negócio Puras)

#### Entidades e Agregados (`src/core/domain`)
- **WorkOrderAggregate:** Garante que uma O.S. contenha os itens necessários e recalcule os totais automaticamente.
- **CustomerAggregate:** Gerencia o vínculo entre o cliente e seus veículos.

#### Value Objects (`src/core/domain/value-objects`)
- **Money:** Centraliza a lógica de cálculos (em centavos) e formatação monetária.
- **CPF/CNPJ:** Encapsula validação de documentos e geração de máscaras.
- **WorkOrderStatus:** State machine para garantir transições válidas (Aberto -> Em Progresso -> Concluído).

### 2.2 Camada de Infraestrutura (Adapters)

#### Comunicação e Mapeamento (`src/infra`)
- **Repositories:** Implementam as interfaces do Core, utilizando o cliente Axios para chamadas à API REST.
- **Mappers:** Transformam os DTOs (JSON da API) em Entidades ricas e vice-versa, protegendo o domínio de mudanças no contrato do backend.
- **Data Sources:** Além da API, utilizar LocalStorage para persistência de rascunhos de O.S. (Offline-first).

### 2.3 Camada de Apresentação (UI)

#### Controllers e Estado (`src/presentation`)
- **Hooks Customizados:** Atuam como intermediários entre os componentes e os Casos de Uso (estilo View-Model/Controller).
- **Context API:** Gerenciar estado global como Autenticação (JWT) e Preferências.

#### Design System (`src/design-system`)
- **Atomic Design:** Componentes devem ser agnósticos a regras de negócio, recebendo dados e eventos via props.
- **Estilização:** Utilizar CSS Vanilla ou CSS Modules para garantir performance e estética premium.

---

## 3. SEO e Acessibilidade (A11y)

Para o microserviço `web-portal`, estes itens são mandatórios:

- **SEO:**
    - Páginas públicas (Landing, Agendamento) devem usar **SSG** e a API de `Metadata` do Next.js.
    - Otimização de imagens com `next/image` e fontes com `next/font`.
- **Acessibilidade:**
    - Seguir **WCAG 2.1 AA**.
    - Navegação completa por teclado e uso de `aria-labels` em ícones e botões interativos.
    - Gerenciamento de foco em modais e diálogos.

---

## 4. Fluxos Críticos de UI

### 4.1 Abertura de Ordem de Serviço
1. A View capta os dados (Placa/CPF).
2. O Controller chama o `CreateWorkOrderUseCase`.
3. O UseCase valida se o cliente é apto e cria a entidade.
4. O Repositório mapeia para DTO e envia via POST.
5. Toast de sucesso e redirecionamento.

---

## 5. Próximos Passos
1. Setup do projeto Next.js com TypeScript e App Router no monorepo.
2. Criação dos tokens de design e componentes básicos (`Button`, `Input`).
3. Implementação dos Value Objects `Money` e `CPF/CNPJ` com testes unitários.
4. Setup do repositório base com Axios interceptors para autenticação.

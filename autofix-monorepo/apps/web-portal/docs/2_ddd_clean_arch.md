# Domain Driven Design (DDD) & Elementos Táticos

Nesta arquitetura, o frontend não é apenas um "exibidor de JSON". Ele possui conhecimento rico sobre as regras de validação, estados e comportamentos das entidades antes mesmo de enviar dados ao backend.

## 1. Agregados (Aggregates)
São clusters de objetos de domínio que podem ser tratados como uma unidade única.

* **WorkOrderAggregate (Ordem de Serviço):**
    * *Raiz:* `WorkOrder`
    * *Composição:* Lista de `ServiceItem`, Lista de `PartItem`, `CustomerSnapshot`, `VehicleSnapshot`.
    * *Regra de Invariância:* Uma O.S. não pode ser finalizada se o total for menor que zero ou se não houver itens.

* **CustomerAggregate:**
    * *Raiz:* `Customer`
    * *Composição:* Lista de `Vehicle`.

## 2. Entidades (Entities)
Objetos identificados por um ID único, não por seus atributos.

* `WorkOrder`: Identificada por UUID. Possui estado mutável (`status`, `updatedAt`).
* `Vehicle`: Identificado pela Placa (ou ID interno).
* `ServiceItem`: O serviço específico realizado (ex: "Troca de Óleo").

## 3. Value Objects (Objetos de Valor)
Objetos imutáveis definidos por seus atributos. Úteis para formatação e validação no frontend.

* `Money`: Encapsula valor decimal e moeda. Tem métodos `format()`, `add()`, `subtract()`.
* `CPF`/`CNPJ`: Encapsula a string do documento. Tem métodos `validate()`, `format()`.
* `WorkOrderStatus`: Enum com máquina de estados (`OPEN`, `IN_PROGRESS`, `DONE`).
* `Email`: Garante que a string armazenada é um email válido.

## 4. Event Driven Design (Frontend Side)
O frontend reage a eventos para atualizar a UI ou disparar efeitos colaterais sem acoplamento direto.

* **Domain Events:** Eventos que ocorrem dentro do domínio.
    * `WorkOrderTotalUpdated`: Disparado quando um item é adicionado à O.S., forçando o recálculo do total na UI.
* **Integration Events:** Eventos vindos do Backend (via WebSocket/SSE).
    * `InventoryLowStock`: Alerta "toast" para o mecânico.
    * `WorkOrderApproved`: Atualiza o status na tela do mecânico em tempo real.

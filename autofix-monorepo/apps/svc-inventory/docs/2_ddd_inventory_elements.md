# DDD: Agregados, Entidades e Value Objects

## 1. Agregado Principal: Product (Produto/Peça)
Representa o item em estoque. É a raiz de consistência.

* **Raiz:** `Product`
* **Atributos:**
    * `sku`: SKU (Identificador único de negócio).
    * `currentStock`: Quantity (Saldo atual).
    * `reservedStock`: Quantity (Comprometido em O.S. aprovadas, mas não finalizadas).
    * `minStockLevel`: Quantity (Ponto de reabastecimento).
* **Comportamentos:**
    * `addStock(qty, cost)`: Aumenta saldo.
    * `reserve(qty)`: Move do saldo disponível para reservado.
    * `confirmConsumption(qty)`: Remove do reservado (Baixa definitiva).
    * `releaseReservation(qty)`: Devolve do reservado para disponível (Cancelamento de O.S.).

## 2. Entidades de Suporte
* **StockMovement (Imutável):**
    * Histórico financeiro e logístico. Cada `addStock` ou `consume` gera um registro aqui.
    * Atributos: `type` (IN/OUT), `reason` (PURCHASE, WORK_ORDER, LOSS), `referenceId` (ID da O.S. ou Nota Fiscal).
* **Supplier:** Fornecedor da peça.

## 3. Value Objects (VOs)
* **SKU (Stock Keeping Unit):** Garante unicidade e formato (ex: `OIL-FIL-001`).
* **Quantity:** Impede valores negativos. Possui lógica de soma e subtração segura.
* **Dimensions:** Peso e tamanho (para cálculo de frete ou alocação em prateleira).

## 4. Event Driven Design (Domain Events)
Eventos gerados pelo domínio de estoque:

* `Product.LowStockDetected`: Disparado quando `currentStock` < `minStockLevel`. Ouve-se para enviar alerta ao gerente ou sugerir compra automática.
* `Product.PriceChanged`: Atualiza o cache do catálogo no API Gateway.

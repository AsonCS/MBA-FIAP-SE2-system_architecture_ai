# Business Rules - web-portal

## 1. Domain Aggregates
* **WorkOrderAggregate:**
    * **Root:** `WorkOrder`.
    * **Rules:** Cannot be completed if total < 0 or if items (Parts/Services) are missing.
* **CustomerAggregate:**
    * **Root:** `Customer`.
    * **Features:** Manages a list of `Vehicle` entities.

## 2. Value Objects (VOs)
* **Money:** Handles precision calculation and formatting.
* **CPF / CNPJ:** Logic for validation and masking.
* **WorkOrderStatus:** State machine (OPEN, IN_PROGRESS, DONE).
* **Email:** Standard email validation.

## 3. Domain Events (Frontend)
* `WorkOrderTotalUpdated`: Forces UI total recalculation when an item is added/removed.
* `InventoryLowStock`: UI Alert/Toast triggered by backend events.
* `WorkOrderApproved`: Real-time status update in the dashboard.

## 4. User Stories
* **US01 - Abertura de O.S.:** Search for existing customers by CPF or Plate to prevent re-entering data.
* **US02 - Adição de Serviços:** Select from predefined services with auto-calculation of estimated time and price.
* **US03 - Aprovação do Cliente:** Detailed view of quote (Parts + Labor) via public web with "Approve" capability.
* **US04 - Kanban de Oficina:** Visual tracking of orders by status (Draft, In Progress, Ready).

## 5. Critical UI Flows
* **Login Flow:** Credential entry -> API Call -> Token Persisence -> Dashboard Redirect.
* **OS Creation (Clean Arch):** 
    1. UI collects form data.
    2. Hook controller validates basics.
    3. UseCase applies business rules.
    4. Repository converts to persistence DTO via Mapper.
    5. API call sends data.
    6. Feedback (Toast) and Redirect.

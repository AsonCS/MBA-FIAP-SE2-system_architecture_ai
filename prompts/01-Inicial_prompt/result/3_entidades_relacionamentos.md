# Entidades e Relacionamentos

Abaixo, as principais entidades do domínio. Como é um sistema SaaS, todas as tabelas principais devem conter uma coluna `tenant_id` para isolamento lógico.

## Entidades Principais
* **Tenant:** A oficina mecânica contratante.
* **User:** Usuários do sistema (vinculados a um Tenant).
* **Customer:** Cliente da oficina.
* **Vehicle:** Veículo (vinculado a um Customer).
* **WorkOrder (OS):** O documento central de serviço.
* **ServiceItem:** Mão de obra dentro da O.S.
* **PartItem:** Peças utilizadas na O.S.
* **Product/Part:** Cadastro de peças no estoque.

## Diagrama de Relacionamento (Conceitual)

```mermaid
erDiagram
    TENANT ||--|{ USER : possui
    TENANT ||--|{ CUSTOMER : atende
    CUSTOMER ||--|{ VEHICLE : dono_de
    VEHICLE ||--|{ WORK_ORDER : recebe
    WORK_ORDER ||--|{ OS_ITEM_SERVICE : contem
    WORK_ORDER ||--|{ OS_ITEM_PART : usa
    PART ||--|{ OS_ITEM_PART : referencia
    USER ||--|{ WORK_ORDER : responsavel_tecnico

    WORK_ORDER {
        uuid id
        uuid tenant_id
        string status
        date data_entrada
        decimal total
    }
    VEHICLE {
        string placa
        string modelo
        string chassi
    }

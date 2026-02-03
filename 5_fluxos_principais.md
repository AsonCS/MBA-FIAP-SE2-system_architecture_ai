# Fluxos Principais

## Fluxo: Abertura e Aprovação de Orçamento
Este fluxo descreve o processo desde a chegada do carro até a aprovação do serviço.

```mermaid
sequenceDiagram
    participant R as Recepcionista
    participant API as API Gateway
    participant SvcOS as Svc WorkOrder
    participant SvcInv as Svc Inventory
    participant SvcNotif as Svc Notification
    participant C as Cliente

    R->>API: POST /work-orders (Criar O.S.)
    API->>SvcOS: Cria O.S. (Status: Em Análise)
    SvcOS-->>R: Retorna ID da O.S.

    Note over R, SvcOS: Mecânico faz a análise

    R->>API: POST /work-orders/{id}/items (Add Peças/Serviços)
    API->>SvcOS: Adiciona itens e calcula total
    
    R->>API: PATCH /work-orders/{id}/status (Aguardando Aprovação)
    API->>SvcOS: Atualiza Status
    SvcOS->>)SvcNotif: Evento: OS_Ready_For_Approval
    SvcNotif->>C: Envia Email/SMS com Link

    C->>API: Clica no Link e Aprova
    API->>SvcOS: PATCH Status (Em Execução)
    SvcOS->>)SvcInv: Evento: OS_Approved
    SvcInv->>SvcInv: Reserva Peças no Estoque

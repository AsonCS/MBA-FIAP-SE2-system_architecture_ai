# Diagrama de Arquitetura

A solução utiliza um **API Gateway** para rotear as requisições para os microserviços apropriados. A comunicação entre serviços para processos não bloqueantes (ex: baixar estoque ao finalizar O.S.) é feita via **Event Bus**.

```mermaid
graph TD
    subgraph "Cliente"
        Browser[Web App / Mobile]
    end

    subgraph "Camada de Entrada"
        Gateway[API Gateway / Load Balancer]
    end

    subgraph "Microserviços (Backend)"
        Auth[Svc: Auth & Users]
        Customer[Svc: Customer & Vehicle]
        OS[Svc: Work Order (Core)]
        Inv[Svc: Inventory]
        Notif[Svc: Notifications]
    end

    subgraph "Persistência (Data)"
        DB_Auth[(DB Auth)]
        DB_Customer[(DB Customer)]
        DB_OS[(DB WorkOrder)]
        DB_Inv[(DB Inventory)]
    end

    subgraph "Mensageria"
        Broker{Message Broker / Event Bus}
    end

    %% Flow
    Browser -->|HTTPS| Gateway
    Gateway -->|Auth / Token| Auth
    Gateway -->|REST| Customer
    Gateway -->|REST| OS
    Gateway -->|REST| Inv

    %% Database Connections
    Auth --- DB_Auth
    Customer --- DB_Customer
    OS --- DB_OS
    Inv --- DB_Inv

    %% Async Communication
    OS -.->|Evento: OS Criada| Broker
    Inv -.->|Evento: Peça Reservada| Broker
    Broker -.->|Consome| Notif
    Broker -.->|Consome| OS
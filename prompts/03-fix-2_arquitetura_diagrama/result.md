O erro de sintaxe no Mermaid geralmente ocorre quando utilizamos caracteres especiais (como `:`, `/`, `&` ou espaços) dentro dos rótulos sem o uso de aspas. Além disso, definir IDs para os subgráficos evita conflitos de renderização.

Aqui está o arquivo corrigido, com todos os textos entre aspas duplas e identificadores de subgráficos ajustados:

### 📂 File: `2_arquitetura_diagrama.md`

```markdown
# Diagrama de Arquitetura

A solução utiliza um **API Gateway** para rotear as requisições para os microserviços apropriados. A comunicação entre serviços para processos não bloqueantes (ex: baixar estoque ao finalizar O.S.) é feita via **Event Bus** (Kafka).

```mermaid
graph TD
    subgraph ClientLayer ["Cliente"]
        Browser["Web App / Mobile"]
    end

    subgraph EntryLayer ["Camada de Entrada"]
        Gateway["API Gateway / Load Balancer"]
    end

    subgraph BackendLayer ["Microserviços (Backend)"]
        Auth["Svc: Auth & Users"]
        Customer["Svc: Customer & Vehicle"]
        OS["Svc: Work Order (Core)"]
        Inv["Svc: Inventory"]
        Notif["Svc: Notifications"]
    end

    subgraph DataLayer ["Persistência (Data)"]
        DB_Auth[("DB Auth")]
        DB_Customer[("DB Customer")]
        DB_OS[("DB WorkOrder")]
        DB_Inv[("DB Inventory")]
    end

    subgraph MsgLayer ["Mensageria"]
        Broker{"Message Broker / Event Bus"}
    end

    %% Flow principal
    Browser -->|"HTTPS"| Gateway
    Gateway -->|"Auth / Token"| Auth
    Gateway -->|"REST"| Customer
    Gateway -->|"REST"| OS
    Gateway -->|"REST"| Inv

    %% Conexões de Banco de Dados
    Auth --- DB_Auth
    Customer --- DB_Customer
    OS --- DB_OS
    Inv --- DB_Inv

    %% Comunicação Assíncrona
    OS -.->|"Evento: OS Criada"| Broker
    Inv -.->|"Evento: Peça Reservada"| Broker
    Broker -.->|"Consome"| Notif
    Broker -.->|"Consome"| OS

```

```

### Principais correções aplicadas:
1.  **Aspas nos Rótulos:** Adicionei aspas duplas `""` em todos os textos dos nós (ex: `["Web App / Mobile"]`) para que caracteres como `/` e `&` não quebrem o parser.
2.  **IDs nos Subgraphs:** Alterei `subgraph "Nome"` para `subgraph ID ["Nome"]` (ex: `subgraph ClientLayer ["Cliente"]`), o que é mais seguro para diferentes renderizadores de Mermaid.
3.  **Cilindros de Banco de Dados:** Garanti que o texto dentro da sintaxe do cilindro `[("Texto")]` também estivesse entre aspas.

### Próximo Passo
Gostaria de ver o diagrama de sequência do "Fluxo de Aprovação" também, para garantir que a lógica do Kafka está clara?

```

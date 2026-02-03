# Fluxos Principais

## Fluxo 1: Login e Hidratação de Sessão
Utiliza NextAuth ou gerenciamento manual de JWT com Context API.

```mermaid
sequenceDiagram
    participant User
    participant Page as Login Page
    participant AuthHook as useAuth
    participant API as Backend API
    participant Router as Next Router

    User->>Page: Digita Credenciais
    Page->>AuthHook: login(email, pass)
    AuthHook->>API: POST /auth/login
    API-->>AuthHook: Returns JWT + UserInfo
    AuthHook->>AuthHook: Persist Token (Cookie/Storage)
    AuthHook-->>Page: Success
    Page->>Router: push('/dashboard')

```

## Fluxo 2: Criação de Ordem de Serviço (Clean Arch Flow)

Demonstra como a View interage com o Domínio.

```mermaid
sequenceDiagram
    participant UI as CreateOS Component
    participant Controller as useCreateOSController
    participant UC as CreateOSUseCase
    participant Repo as WorkOrderRepository
    participant Mapper as WorkOrderMapper

    UI->>Controller: onSubmit(formData)
    Controller->>Controller: Valida Form Básico
    
    Controller->>UC: execute(inputData)
    Note right of UC: Aplica regras de negócio<br/>(ex: Cliente ativo?)
    
    UC->>Repo: create(workOrderEntity)
    Repo->>Mapper: toPersistence(entity)
    Repo->>Repo: axios.post('/os', dto)
    Repo-->>UC: void
    
    UC-->>Controller: Success
    Controller->>UI: Show Toast "OS Criada"
    Controller->>UI: Redirect to Details

```

# Fluxos Principais

## Fluxo 1: Autenticação (Login) com Refresh Token
Este fluxo garante segurança e renovação de sessão sem forçar logout constante.

```mermaid
sequenceDiagram
    participant Client
    participant Controller as AuthController
    participant UC as LoginUseCase
    participant Repo as UserRepository
    participant Hash as BCryptService
    participant JWT as TokenService
    participant Redis

    Client->>Controller: POST /auth/login (email, pass)
    Controller->>UC: execute(email, pass)
    
    UC->>Repo: findByEmail(email)
    Repo-->>UC: UserEntity (com Hash)
    
    UC->>Hash: compare(pass, user.passwordHash)
    
    alt Senha Inválida
        Hash-->>UC: false
        UC-->>Client: 401 Unauthorized
    else Senha Válida
        Hash-->>UC: true
        UC->>JWT: generateAccessToken(payload)
        UC->>JWT: generateRefreshToken()
        
        par Persistência
            UC->>Redis: Save RefreshToken (TTL 7d)
        and
            UC-->>Client: Returns { access_token, refresh_token }
        end
    end

```

## Fluxo 2: Criação de Tenant (Transacional)

Cria a organização e o primeiro usuário (Admin) atomicamente.

```mermaid
sequenceDiagram
    participant API
    participant UC as CreateTenantUseCase
    participant RepoT as TenantRepository
    participant RepoU as UserRepository
    participant Bus as KafkaProducer

    API->>UC: execute(companyData, adminData)
    
    Note right of UC: Inicia Transação DB
    
    UC->>RepoT: save(new Tenant)
    RepoT-->>UC: tenant_id
    
    UC->>UC: Cria User Admin vinculado ao tenant_id
    UC->>RepoU: save(new User)
    
    Note right of UC: Commit Transação
    
    UC->>Bus: Publish "TenantCreated"
    UC->>Bus: Publish "UserRegistered"
    
    UC-->>API: Success (201 Created)

```

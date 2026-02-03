# DDD: Agregados, Entidades e Value Objects

A modelagem de identidade foca em segurança e multi-tenancy.

## 1. Agregados (Aggregates)

* **TenantAggregate (Raiz: Tenant):**
    * Representa a oficina/empresa contratante.
    * *Regras:* Um Tenant deve ter pelo menos um usuário "Owner" no momento da criação.
    * *Comportamentos:* `addSubscription()`, `changeStatus(ACTIVE/SUSPENDED)`.

* **UserAggregate (Raiz: User):**
    * O usuário do sistema.
    * *Composição:* `Role` (Cargo), `Credentials` (separado da entidade User por segurança).
    * *Regras:* Um email deve ser único globalmente (ou por Tenant, dependendo da estratégia).
    * *Comportamentos:* `changePassword()`, `assignRole()`.

## 2. Value Objects (Objetos de Valor)

* **Email:** Valida formato e normaliza (lowercase).
* **Password:**
    * Não armazena a senha plana.
    * Ao ser criado, recebe a senha plana, mas internamente já converte para Hash.
    * Possui método `compare(plainText): boolean`.
* **CPF/CNPJ:** Lógica de validação de documentos brasileiros.
* **UserRole:** Enum (`OWNER`, `MECHANIC`, `RECEPTIONIST`, `ADMIN`).

## 3. Event Driven Design (Domain Events)

Eventos disparados pelo `svc-auth` que interessam a outros serviços:

* `UserRegistered`: Interessante para o *svc-notification* enviar email de boas-vindas.
* `TenantCreated`: Interessante para *svc-work-order* e *svc-inventory* provisionarem recursos iniciais se necessário.
* `UserDeleted`: Comanda a exclusão/anomização de dados em outros serviços (GDPR/LGPD).

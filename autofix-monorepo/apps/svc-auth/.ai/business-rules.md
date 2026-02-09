# Business Rules - svc-auth

## 1. Domain Aggregates

### TenantAggregate
* **Root:** Tenant (The workshop/company).
* **Rule:** Must have at least one "Owner" user upon creation.
* **Behaviors:** `addSubscription()`, `changeStatus(ACTIVE/SUSPENDED)`.

### UserAggregate
* **Root:** User.
* **Composition:** Includes `Role` and `Credentials`.
* **Rule:** Email must be globally unique.
* **Behaviors:** `changePassword()`, `assignRole()`.

## 2. Value Objects
* **Email:** Format validation and normalization (lowercase).
* **Password:** Handles complexity and automatic hashing (never plain-text).
* **CPF/CNPJ:** Brazilian document validation logic.
* **UserRole:** OWNER, MECHANIC, RECEPTIONIST, ADMIN.

## 3. User Stories
* **US01:** Company Onboarding (Tenant + Admin User creation).
* **US02:** Secure Login (Email/Password -> JWT Access + Refresh Token).
* **US03:** Staff Invitation (Owner invites Mechanic via email).
* **US04:** Password Recovery (Temporal unique link).

## 4. Domain Events
* `UserRegistered`: Triggers welcome email via `svc-notification`.
* `TenantCreated`: Triggers resource provisioning in `svc-work-order` and `svc-inventory`.
* `UserDeleted`: Commands data anonymization (GDPR compliance).

## 5. Critical Flows

### Login Flow
1. Receive Email/Pass.
2. Find User by Email.
3. Compare Hash.
4. If valid, generate Tokens.
5. Save Refresh Token in Redis.

### Tenant Creation (Atomic)
1. Start DB Transaction.
2. Save Tenant.
3. Create & Save Admin User.
4. Commit Transaction.
5. Publish `TenantCreated` and `UserRegistered` events.

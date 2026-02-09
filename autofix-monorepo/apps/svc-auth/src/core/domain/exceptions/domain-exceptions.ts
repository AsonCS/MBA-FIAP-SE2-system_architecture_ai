export class DomainException extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class UserNotFoundError extends DomainException {
    constructor(identifier: string) {
        super(`User not found: ${identifier}`);
    }
}

export class TenantNotFoundError extends DomainException {
    constructor(identifier: string) {
        super(`Tenant not found: ${identifier}`);
    }
}

export class InvalidCredentialsError extends DomainException {
    constructor() {
        super('Invalid email or password');
    }
}

export class DuplicateEmailError extends DomainException {
    constructor(email: string) {
        super(`Email already exists: ${email}`);
    }
}

export class DuplicateCNPJError extends DomainException {
    constructor(cnpj: string) {
        super(`CNPJ already registered: ${cnpj}`);
    }
}

export class InactiveUserError extends DomainException {
    constructor(userId: string) {
        super(`User is inactive: ${userId}`);
    }
}

export class SuspendedTenantError extends DomainException {
    constructor(tenantId: string) {
        super(`Tenant is suspended: ${tenantId}`);
    }
}

export class UnauthorizedError extends DomainException {
    constructor(message: string = 'Unauthorized access') {
        super(message);
    }
}

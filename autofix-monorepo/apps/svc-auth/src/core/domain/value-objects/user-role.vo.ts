export enum UserRole {
    OWNER = 'OWNER',
    ADMIN = 'ADMIN',
    MECHANIC = 'MECHANIC',
    RECEPTIONIST = 'RECEPTIONIST',
}

export class InvalidRoleError extends Error {
    constructor(role: string) {
        super(`Invalid user role: ${role}`);
        this.name = 'InvalidRoleError';
    }
}

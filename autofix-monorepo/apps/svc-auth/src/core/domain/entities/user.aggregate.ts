import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';
import { UserRole } from '../value-objects/user-role.vo';

export interface UserProps {
    id: string;
    email: Email;
    password: Password;
    role: UserRole;
    tenantId: string;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class UserAggregate {
    private props: UserProps;

    private constructor(props: UserProps) {
        this.props = props;
    }

    static create(props: Omit<UserProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>): UserAggregate {
        const now = new Date();
        return new UserAggregate({
            ...props,
            id: this.generateId(),
            isActive: true,
            createdAt: now,
            updatedAt: now,
        });
    }

    static reconstitute(props: UserProps): UserAggregate {
        return new UserAggregate(props);
    }

    private static generateId(): string {
        return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    // Getters
    get id(): string {
        return this.props.id;
    }

    get email(): Email {
        return this.props.email;
    }

    get password(): Password {
        return this.props.password;
    }

    get role(): UserRole {
        return this.props.role;
    }

    get tenantId(): string {
        return this.props.tenantId;
    }

    get name(): string {
        return this.props.name;
    }

    get isActive(): boolean {
        return this.props.isActive;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    // Business Methods
    changePassword(newPassword: Password): void {
        this.props.password = newPassword;
        this.props.updatedAt = new Date();
    }

    assignRole(role: UserRole): void {
        this.props.role = role;
        this.props.updatedAt = new Date();
    }

    deactivate(): void {
        this.props.isActive = false;
        this.props.updatedAt = new Date();
    }

    activate(): void {
        this.props.isActive = true;
        this.props.updatedAt = new Date();
    }

    async validatePassword(plainPassword: string, hasher: { compare(plain: string, hash: string): Promise<boolean> }): Promise<boolean> {
        return this.props.password.compare(plainPassword, hasher);
    }
}

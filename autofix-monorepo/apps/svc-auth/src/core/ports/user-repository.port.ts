import { UserAggregate } from '../domain/entities/user.aggregate';

export interface IUserRepository {
    findById(id: string): Promise<UserAggregate | null>;
    findByEmail(email: string): Promise<UserAggregate | null>;
    findByTenantId(tenantId: string): Promise<UserAggregate[]>;
    save(user: UserAggregate): Promise<void>;
    delete(id: string): Promise<void>;
}

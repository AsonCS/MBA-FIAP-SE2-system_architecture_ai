import { TenantAggregate } from '../domain/entities/tenant.aggregate';

export interface ITenantRepository {
    findById(id: string): Promise<TenantAggregate | null>;
    findByCNPJ(cnpj: string): Promise<TenantAggregate | null>;
    save(tenant: TenantAggregate): Promise<void>;
    delete(id: string): Promise<void>;
}

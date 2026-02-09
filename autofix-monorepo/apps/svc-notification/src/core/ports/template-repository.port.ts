import { MessageTemplate } from '../domain/entities';

export interface ITemplateRepository {
    findById(id: string): Promise<MessageTemplate | null>;
    findByName(name: string): Promise<MessageTemplate | null>;
    save(template: MessageTemplate): Promise<void>;
    findAll(): Promise<MessageTemplate[]>;
}

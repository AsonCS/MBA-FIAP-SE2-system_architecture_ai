import { MessageTemplate } from '../../../core/domain/entities';
import { MessageTemplateEntity } from '../entities';

export class MessageTemplateMapper {
    static toDomain(entity: MessageTemplateEntity): MessageTemplate {
        return new MessageTemplate(
            entity.id,
            entity.name,
            entity.subject,
            entity.body,
            entity.requiredVariables || [],
            entity.channel as any,
            entity.createdAt,
            entity.updatedAt,
        );
    }

    static toPersistence(domain: MessageTemplate): MessageTemplateEntity {
        const entity = new MessageTemplateEntity();

        entity.id = domain.getId();
        entity.name = domain.getName();
        entity.subject = domain.getSubject();
        entity.body = domain.getBody();
        entity.requiredVariables = domain.getRequiredVariables();
        entity.channel = domain.getChannel();
        entity.createdAt = domain.getCreatedAt();
        entity.updatedAt = domain.getUpdatedAt();

        return entity;
    }
}

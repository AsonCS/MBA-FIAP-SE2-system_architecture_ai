export class MessageTemplate {
    private readonly id: string;
    private readonly name: string;
    private readonly subject: string;
    private readonly body: string;
    private readonly requiredVariables: string[];
    private readonly channel: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH';
    private readonly createdAt: Date;
    private updatedAt: Date;

    constructor(
        id: string,
        name: string,
        subject: string,
        body: string,
        requiredVariables: string[],
        channel: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH',
        createdAt?: Date,
        updatedAt?: Date,
    ) {
        if (!id || id.trim().length === 0) {
            throw new Error('Template ID cannot be empty');
        }
        if (!name || name.trim().length === 0) {
            throw new Error('Template name cannot be empty');
        }
        if (!body || body.trim().length === 0) {
            throw new Error('Template body cannot be empty');
        }

        this.id = id;
        this.name = name;
        this.subject = subject;
        this.body = body;
        this.requiredVariables = requiredVariables || [];
        this.channel = channel;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }

    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getSubject(): string {
        return this.subject;
    }

    getBody(): string {
        return this.body;
    }

    getRequiredVariables(): string[] {
        return [...this.requiredVariables];
    }

    getChannel(): 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH' {
        return this.channel;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    validateVariables(variables: Record<string, any>): boolean {
        return this.requiredVariables.every((varName) => {
            return variables.hasOwnProperty(varName) && variables[varName] !== undefined && variables[varName] !== null;
        });
    }

    getMissingVariables(variables: Record<string, any>): string[] {
        return this.requiredVariables.filter((varName) => {
            return !variables.hasOwnProperty(varName) || variables[varName] === undefined || variables[varName] === null;
        });
    }

    touch(): void {
        this.updatedAt = new Date();
    }
}

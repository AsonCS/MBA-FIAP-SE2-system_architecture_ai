export class Content {
    private readonly subject: string;
    private readonly body: string;

    constructor(subject: string, body: string) {
        if (!subject || subject.trim().length === 0) {
            throw new Error('Subject cannot be empty');
        }
        if (!body || body.trim().length === 0) {
            throw new Error('Body cannot be empty');
        }

        this.subject = subject.trim();
        this.body = body.trim();
    }

    getSubject(): string {
        return this.subject;
    }

    getBody(): string {
        return this.body;
    }

    equals(other: Content): boolean {
        return this.subject === other.subject && this.body === other.body;
    }
}

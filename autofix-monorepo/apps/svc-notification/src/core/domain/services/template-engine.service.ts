import Handlebars from 'handlebars';
import { MessageTemplate } from '../entities';
import { Content } from '../value-objects';

export class TemplateEngine {
    private compiler: typeof Handlebars;

    constructor() {
        this.compiler = Handlebars;
        this.registerHelpers();
    }

    private registerHelpers(): void {
        // Register custom helpers for safe escaping and formatting
        this.compiler.registerHelper('uppercase', (str: string) => {
            return str ? str.toUpperCase() : '';
        });

        this.compiler.registerHelper('lowercase', (str: string) => {
            return str ? str.toLowerCase() : '';
        });

        this.compiler.registerHelper('formatDate', (date: Date) => {
            if (!date) return '';
            return new Date(date).toLocaleDateString('pt-BR');
        });

        this.compiler.registerHelper('formatCurrency', (value: number) => {
            if (value === undefined || value === null) return '';
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(value);
        });
    }

    compile(template: MessageTemplate, variables: Record<string, any>): Content {
        // Validate that all required variables are present
        if (!template.validateVariables(variables)) {
            const missing = template.getMissingVariables(variables);
            throw new Error(
                `Missing required variables for template ${template.getName()}: ${missing.join(', ')}`,
            );
        }

        try {
            // Compile subject
            const subjectTemplate = this.compiler.compile(template.getSubject(), {
                noEscape: false, // Enable HTML escaping for security
            });
            const compiledSubject = subjectTemplate(variables);

            // Compile body
            const bodyTemplate = this.compiler.compile(template.getBody(), {
                noEscape: false, // Enable HTML escaping for security
            });
            const compiledBody = bodyTemplate(variables);

            return new Content(compiledSubject, compiledBody);
        } catch (error) {
            throw new Error(
                `Failed to compile template ${template.getName()}: ${error.message}`,
            );
        }
    }

    compileRaw(subject: string, body: string, variables: Record<string, any>): Content {
        try {
            const subjectTemplate = this.compiler.compile(subject, { noEscape: false });
            const compiledSubject = subjectTemplate(variables);

            const bodyTemplate = this.compiler.compile(body, { noEscape: false });
            const compiledBody = bodyTemplate(variables);

            return new Content(compiledSubject, compiledBody);
        } catch (error) {
            throw new Error(`Failed to compile raw template: ${error.message}`);
        }
    }
}

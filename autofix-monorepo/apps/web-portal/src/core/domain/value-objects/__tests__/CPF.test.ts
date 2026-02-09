import { CPF } from '../CPF';

describe('CPF Value Object', () => {
    const validCPF = '12345678909';
    const validCPFFormatted = '123.456.789-09';

    describe('Creation', () => {
        it('should create CPF from valid unformatted string', () => {
            const cpf = CPF.create(validCPF);
            expect(cpf.value).toBe(validCPF);
        });

        it('should create CPF from valid formatted string', () => {
            const cpf = CPF.create(validCPFFormatted);
            expect(cpf.value).toBe(validCPF);
        });

        it('should throw error for invalid CPF', () => {
            expect(() => CPF.create('12345678901')).toThrow('Invalid CPF');
            expect(() => CPF.create('00000000000')).toThrow('Invalid CPF');
            expect(() => CPF.create('11111111111')).toThrow('Invalid CPF');
        });

        it('should throw error for CPF with wrong length', () => {
            expect(() => CPF.create('123')).toThrow('Invalid CPF');
            expect(() => CPF.create('123456789012345')).toThrow('Invalid CPF');
        });
    });

    describe('Validation', () => {
        it('should validate correct CPFs', () => {
            expect(CPF.isValid('12345678909')).toBe(true);
            expect(CPF.isValid('123.456.789-09')).toBe(true);
        });

        it('should reject invalid CPFs', () => {
            expect(CPF.isValid('12345678901')).toBe(false);
            expect(CPF.isValid('00000000000')).toBe(false);
            expect(CPF.isValid('11111111111')).toBe(false);
            expect(CPF.isValid('123')).toBe(false);
        });

        it('should reject CPFs with all same digits', () => {
            for (let i = 0; i <= 9; i++) {
                const sameCPF = i.toString().repeat(11);
                expect(CPF.isValid(sameCPF)).toBe(false);
            }
        });
    });

    describe('Formatting', () => {
        it('should return formatted CPF', () => {
            const cpf = CPF.create(validCPF);
            expect(cpf.formatted).toBe(validCPFFormatted);
        });

        it('should return raw value', () => {
            const cpf = CPF.create(validCPFFormatted);
            expect(cpf.value).toBe(validCPF);
        });
    });

    describe('Equality', () => {
        it('should check equality correctly', () => {
            const cpf1 = CPF.create(validCPF);
            const cpf2 = CPF.create(validCPFFormatted);
            const cpf3 = CPF.create('98765432100');

            expect(cpf1.equals(cpf2)).toBe(true);
            expect(cpf1.equals(cpf3)).toBe(false);
        });
    });

    describe('Serialization', () => {
        it('should convert to JSON', () => {
            const cpf = CPF.create(validCPF);
            const json = cpf.toJSON();
            expect(json.value).toBe(validCPF);
            expect(json.formatted).toBe(validCPFFormatted);
        });

        it('should convert to string', () => {
            const cpf = CPF.create(validCPF);
            expect(cpf.toString()).toBe(validCPFFormatted);
        });
    });
});

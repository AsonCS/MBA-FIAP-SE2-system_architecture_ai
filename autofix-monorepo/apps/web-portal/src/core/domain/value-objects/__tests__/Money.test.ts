import { Money } from '../Money';

describe('Money Value Object', () => {
    describe('Creation', () => {
        it('should create Money from cents', () => {
            const money = Money.fromCents(1000);
            expect(money.cents).toBe(1000);
            expect(money.amount).toBe(10);
        });

        it('should create Money from amount', () => {
            const money = Money.fromAmount(10.50);
            expect(money.cents).toBe(1050);
            expect(money.amount).toBe(10.50);
        });

        it('should create Money from string', () => {
            const money1 = Money.fromString('10.50');
            expect(money1.amount).toBe(10.50);

            const money2 = Money.fromString('R$ 10,50');
            expect(money2.amount).toBe(10.50);
        });

        it('should create zero money', () => {
            const money = Money.zero();
            expect(money.cents).toBe(0);
            expect(money.isZero()).toBe(true);
        });

        it('should throw error for negative amounts', () => {
            expect(() => Money.fromAmount(-10)).toThrow('Amount cannot be negative');
            expect(() => Money.fromCents(-100)).toThrow('Money cannot be negative');
        });

        it('should throw error for non-integer cents', () => {
            expect(() => Money.fromCents(10.5)).toThrow('Money must be represented in whole cents');
        });

        it('should throw error for invalid string', () => {
            expect(() => Money.fromString('invalid')).toThrow('Invalid money string');
        });
    });

    describe('Arithmetic Operations', () => {
        it('should add two Money values', () => {
            const money1 = Money.fromAmount(10);
            const money2 = Money.fromAmount(5);
            const result = money1.add(money2);
            expect(result.amount).toBe(15);
        });

        it('should subtract two Money values', () => {
            const money1 = Money.fromAmount(10);
            const money2 = Money.fromAmount(5);
            const result = money1.subtract(money2);
            expect(result.amount).toBe(5);
        });

        it('should throw error when subtraction results in negative', () => {
            const money1 = Money.fromAmount(5);
            const money2 = Money.fromAmount(10);
            expect(() => money1.subtract(money2)).toThrow('Subtraction would result in negative money');
        });

        it('should multiply by a factor', () => {
            const money = Money.fromAmount(10);
            const result = money.multiply(2);
            expect(result.amount).toBe(20);
        });

        it('should handle decimal multiplication correctly', () => {
            const money = Money.fromAmount(10);
            const result = money.multiply(1.5);
            expect(result.amount).toBe(15);
        });

        it('should throw error when multiplying by negative', () => {
            const money = Money.fromAmount(10);
            expect(() => money.multiply(-2)).toThrow('Cannot multiply by negative factor');
        });

        it('should divide by a divisor', () => {
            const money = Money.fromAmount(10);
            const result = money.divide(2);
            expect(result.amount).toBe(5);
        });

        it('should throw error when dividing by zero or negative', () => {
            const money = Money.fromAmount(10);
            expect(() => money.divide(0)).toThrow('Cannot divide by zero or negative number');
            expect(() => money.divide(-2)).toThrow('Cannot divide by zero or negative number');
        });
    });

    describe('Comparison Operations', () => {
        it('should compare Money values correctly', () => {
            const money1 = Money.fromAmount(10);
            const money2 = Money.fromAmount(5);
            const money3 = Money.fromAmount(10);

            expect(money1.greaterThan(money2)).toBe(true);
            expect(money2.lessThan(money1)).toBe(true);
            expect(money1.equals(money3)).toBe(true);
            expect(money1.equals(money2)).toBe(false);
        });
    });

    describe('Formatting', () => {
        it('should format as Brazilian Real', () => {
            const money = Money.fromAmount(1234.56);
            const formatted = money.format('pt-BR');
            expect(formatted).toContain('1.234,56');
        });

        it('should format without currency symbol', () => {
            const money = Money.fromAmount(1234.56);
            const formatted = money.formatWithoutSymbol('pt-BR');
            expect(formatted).toBe('1.234,56');
        });
    });

    describe('Serialization', () => {
        it('should convert to JSON', () => {
            const money = Money.fromAmount(10.50);
            const json = money.toJSON();
            expect(json.cents).toBe(1050);
            expect(json.amount).toBe(10.50);
            expect(json.formatted).toContain('10,50');
        });

        it('should convert to string', () => {
            const money = Money.fromAmount(10.50);
            const str = money.toString();
            expect(str).toContain('10,50');
        });
    });
});

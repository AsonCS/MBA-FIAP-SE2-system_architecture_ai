import { Money } from '../value-objects';

/**
 * TaxCalculator Domain Service
 * Handles tax calculations for work orders
 */
export interface TaxCalculationInput {
    subtotal: Money;
    taxRate: number; // Percentage (e.g., 0.18 for 18%)
}

export interface TaxCalculationResult {
    subtotal: Money;
    taxAmount: Money;
    total: Money;
}

export class TaxCalculator {
    /**
     * Calculates tax for a given subtotal
     */
    static calculate(input: TaxCalculationInput): TaxCalculationResult {
        if (input.taxRate < 0 || input.taxRate > 1) {
            throw new Error('Tax rate must be between 0 and 1');
        }

        const taxAmount = input.subtotal.multiply(input.taxRate);
        const total = input.subtotal.add(taxAmount);

        return {
            subtotal: input.subtotal,
            taxAmount,
            total,
        };
    }

    /**
     * Calculates tax for multiple items with different tax rates
     */
    static calculateMultiple(
        items: Array<{ subtotal: Money; taxRate: number }>,
    ): TaxCalculationResult {
        let totalSubtotal = Money.zero();
        let totalTax = Money.zero();

        for (const item of items) {
            const result = this.calculate(item);
            totalSubtotal = totalSubtotal.add(result.subtotal);
            totalTax = totalTax.add(result.taxAmount);
        }

        return {
            subtotal: totalSubtotal,
            taxAmount: totalTax,
            total: totalSubtotal.add(totalTax),
        };
    }
}

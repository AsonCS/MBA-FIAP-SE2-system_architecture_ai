import { Money } from '../value-objects';

/**
 * ProfitMarginService Domain Service
 * Calculates profit margins and pricing
 */
export interface ProfitMarginInput {
    cost: Money;
    marginPercentage: number; // Percentage (e.g., 0.30 for 30%)
}

export interface ProfitMarginResult {
    cost: Money;
    margin: Money;
    sellingPrice: Money;
    marginPercentage: number;
}

export class ProfitMarginService {
    /**
     * Calculates selling price based on cost and desired margin
     */
    static calculateSellingPrice(input: ProfitMarginInput): ProfitMarginResult {
        if (input.marginPercentage < 0) {
            throw new Error('Margin percentage cannot be negative');
        }

        const margin = input.cost.multiply(input.marginPercentage);
        const sellingPrice = input.cost.add(margin);

        return {
            cost: input.cost,
            margin,
            sellingPrice,
            marginPercentage: input.marginPercentage,
        };
    }

    /**
     * Calculates margin from cost and selling price
     */
    static calculateMargin(cost: Money, sellingPrice: Money): ProfitMarginResult {
        if (sellingPrice.lessThan(cost)) {
            throw new Error('Selling price cannot be less than cost');
        }

        const margin = sellingPrice.subtract(cost);
        const marginPercentage = cost.cents > 0 ? margin.cents / cost.cents : 0;

        return {
            cost,
            margin,
            sellingPrice,
            marginPercentage,
        };
    }

    /**
     * Calculates cost from selling price and margin percentage
     */
    static calculateCost(
        sellingPrice: Money,
        marginPercentage: number,
    ): ProfitMarginResult {
        if (marginPercentage < 0) {
            throw new Error('Margin percentage cannot be negative');
        }
        if (marginPercentage >= 1) {
            throw new Error('Margin percentage must be less than 100%');
        }

        const cost = sellingPrice.divide(1 + marginPercentage);
        const margin = sellingPrice.subtract(cost);

        return {
            cost,
            margin,
            sellingPrice,
            marginPercentage,
        };
    }
}

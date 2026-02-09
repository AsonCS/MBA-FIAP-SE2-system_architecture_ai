/**
 * AdjustStockCommand
 * Command to manually adjust stock levels
 */
export class AdjustStockCommand {
    constructor(
        public readonly sku: string,
        public readonly newQuantity: number,
        public readonly reason: string,
        public readonly adjustedBy: string,
    ) { }
}

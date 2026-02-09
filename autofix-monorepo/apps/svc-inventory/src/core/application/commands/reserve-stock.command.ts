/**
 * ReserveStockCommand
 * Command to reserve stock for work orders
 */
export class ReserveStockCommand {
    constructor(
        public readonly sku: string,
        public readonly quantity: number,
        public readonly workOrderId: string,
    ) { }
}

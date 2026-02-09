/**
 * ConsumeStockCommand
 * Command to confirm stock consumption (e.g., work order completed)
 */
export class ConsumeStockCommand {
    constructor(
        public readonly sku: string,
        public readonly quantity: number,
        public readonly workOrderId: string,
        public readonly consumedBy: string,
    ) { }
}

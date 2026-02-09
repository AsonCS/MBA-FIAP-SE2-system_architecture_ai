/**
 * GetStockLedgerQuery
 * Query to get stock movement history (Kardex)
 */
export class GetStockLedgerQuery {
    constructor(
        public readonly sku: string,
        public readonly page: number = 1,
        public readonly limit: number = 50,
    ) { }
}

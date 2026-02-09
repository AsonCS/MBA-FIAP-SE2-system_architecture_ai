import { Module } from '@nestjs/common';
import { AdjustStockHandler } from './commands/adjust-stock.handler';
import { ReserveStockHandler } from './commands/reserve-stock.handler';
import { ConsumeStockHandler } from './commands/consume-stock.handler';
import { GetProductAvailabilityHandler } from './queries/get-product-availability.handler';
import { GetStockLedgerHandler } from './queries/get-stock-ledger.handler';

/**
 * ApplicationModule
 * Provides command and query handlers
 */
@Module({
    providers: [
        AdjustStockHandler,
        ReserveStockHandler,
        ConsumeStockHandler,
        GetProductAvailabilityHandler,
        GetStockLedgerHandler,
    ],
    exports: [
        AdjustStockHandler,
        ReserveStockHandler,
        ConsumeStockHandler,
        GetProductAvailabilityHandler,
        GetStockLedgerHandler,
    ],
})
export class ApplicationModule { }

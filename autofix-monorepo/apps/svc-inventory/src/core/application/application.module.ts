import { Module, forwardRef } from '@nestjs/common';
import { AdjustStockHandler } from './commands/adjust-stock.handler';
import { ReserveStockHandler } from './commands/reserve-stock.handler';
import { ConsumeStockHandler } from './commands/consume-stock.handler';
import { GetProductAvailabilityHandler } from './queries/get-product-availability.handler';
import { GetStockLedgerHandler } from './queries/get-stock-ledger.handler';
import { DatabaseModule } from '../../infra/database/database.module';
import { CacheModule } from '../../infra/cache/cache.module';
import { MessagingModule } from '../../infra/messaging/messaging.module';

/**
 * ApplicationModule
 * Provides command and query handlers
 */
@Module({
    imports: [
        DatabaseModule,
        CacheModule,
        forwardRef(() => MessagingModule),
    ],
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

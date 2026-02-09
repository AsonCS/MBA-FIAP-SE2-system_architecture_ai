import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { StockMovementEntity } from './entities/stock-movement.entity';
import { TypeOrmProductRepository } from './repositories/typeorm-product.repository';
import { TypeOrmMovementRepository } from './repositories/typeorm-movement.repository';
import { IProductRepository } from '../../core/ports/product.repository.interface';
import { IMovementRepository } from '../../core/ports/movement.repository.interface';

/**
 * DatabaseModule
 * Configures TypeORM and provides repository implementations
 */
@Module({
    imports: [TypeOrmModule.forFeature([ProductEntity, StockMovementEntity])],
    providers: [
        {
            provide: 'IProductRepository',
            useClass: TypeOrmProductRepository,
        },
        {
            provide: 'IMovementRepository',
            useClass: TypeOrmMovementRepository,
        },
    ],
    exports: ['IProductRepository', 'IMovementRepository'],
})
export class DatabaseModule { }

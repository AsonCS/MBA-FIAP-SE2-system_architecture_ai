import { IMovementRepository } from '../../ports/movement.repository.interface';
import { GetStockLedgerQuery } from './get-stock-ledger.query';
import { StockMovement } from '../../domain/entities/stock-movement.entity';

/**
 * StockMovementDTO
 * Data transfer object for stock movements
 */
export interface StockMovementDTO {
    id: string;
    sku: string;
    type: string;
    reason: string;
    quantity: number;
    balanceAfter: number;
    cost?: number;
    reference?: string;
    notes?: string;
    createdBy: string;
    createdAt: Date;
}

/**
 * GetStockLedgerHandler
 * Handles stock ledger (Kardex) queries
 */
export class GetStockLedgerHandler {
    constructor(private readonly movementRepository: IMovementRepository) { }

    async execute(query: GetStockLedgerQuery): Promise<StockMovementDTO[]> {
        const movements = await this.movementRepository.findBySku(
            query.sku,
            query.page,
            query.limit,
        );

        return movements.map((movement) => this.toDTO(movement));
    }

    private toDTO(movement: StockMovement): StockMovementDTO {
        return {
            id: movement.getId(),
            sku: movement.getSku(),
            type: movement.getType(),
            reason: movement.getReason(),
            quantity: movement.getQuantity(),
            balanceAfter: movement.getBalanceAfter(),
            cost: movement.getCost(),
            reference: movement.getReference(),
            notes: movement.getNotes(),
            createdBy: movement.getCreatedBy(),
            createdAt: movement.getCreatedAt(),
        };
    }
}

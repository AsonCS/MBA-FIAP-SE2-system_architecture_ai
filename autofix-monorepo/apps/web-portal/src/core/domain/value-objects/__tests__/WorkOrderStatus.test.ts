import { WorkOrderStatus, WorkOrderStatusEnum } from '../WorkOrderStatus';

describe('WorkOrderStatus Value Object', () => {
    describe('Creation', () => {
        it('should create status from enum value', () => {
            const status = WorkOrderStatus.create(WorkOrderStatusEnum.OPEN);
            expect(status.value).toBe(WorkOrderStatusEnum.OPEN);
        });

        it('should create status from string', () => {
            const status = WorkOrderStatus.fromString('OPEN');
            expect(status.value).toBe(WorkOrderStatusEnum.OPEN);
        });

        it('should create OPEN status', () => {
            const status = WorkOrderStatus.open();
            expect(status.isOpen()).toBe(true);
        });

        it('should throw error for invalid string', () => {
            expect(() => WorkOrderStatus.fromString('INVALID')).toThrow('Invalid work order status');
        });
    });

    describe('Labels', () => {
        it('should return correct Portuguese labels', () => {
            expect(WorkOrderStatus.create(WorkOrderStatusEnum.OPEN).label).toBe('Aberta');
            expect(WorkOrderStatus.create(WorkOrderStatusEnum.IN_PROGRESS).label).toBe('Em Progresso');
            expect(WorkOrderStatus.create(WorkOrderStatusEnum.AWAITING_APPROVAL).label).toBe('Aguardando Aprovação');
            expect(WorkOrderStatus.create(WorkOrderStatusEnum.APPROVED).label).toBe('Aprovada');
            expect(WorkOrderStatus.create(WorkOrderStatusEnum.REJECTED).label).toBe('Rejeitada');
            expect(WorkOrderStatus.create(WorkOrderStatusEnum.COMPLETED).label).toBe('Concluída');
            expect(WorkOrderStatus.create(WorkOrderStatusEnum.CANCELLED).label).toBe('Cancelada');
        });
    });

    describe('State Transitions', () => {
        it('should allow valid transitions from OPEN', () => {
            const open = WorkOrderStatus.create(WorkOrderStatusEnum.OPEN);
            const inProgress = WorkOrderStatus.create(WorkOrderStatusEnum.IN_PROGRESS);
            const cancelled = WorkOrderStatus.create(WorkOrderStatusEnum.CANCELLED);

            expect(open.canTransitionTo(inProgress)).toBe(true);
            expect(open.canTransitionTo(cancelled)).toBe(true);
        });

        it('should reject invalid transitions from OPEN', () => {
            const open = WorkOrderStatus.create(WorkOrderStatusEnum.OPEN);
            const completed = WorkOrderStatus.create(WorkOrderStatusEnum.COMPLETED);

            expect(open.canTransitionTo(completed)).toBe(false);
        });

        it('should allow valid transitions from IN_PROGRESS', () => {
            const inProgress = WorkOrderStatus.create(WorkOrderStatusEnum.IN_PROGRESS);
            const awaitingApproval = WorkOrderStatus.create(WorkOrderStatusEnum.AWAITING_APPROVAL);
            const cancelled = WorkOrderStatus.create(WorkOrderStatusEnum.CANCELLED);

            expect(inProgress.canTransitionTo(awaitingApproval)).toBe(true);
            expect(inProgress.canTransitionTo(cancelled)).toBe(true);
        });

        it('should allow valid transitions from AWAITING_APPROVAL', () => {
            const awaiting = WorkOrderStatus.create(WorkOrderStatusEnum.AWAITING_APPROVAL);
            const approved = WorkOrderStatus.create(WorkOrderStatusEnum.APPROVED);
            const rejected = WorkOrderStatus.create(WorkOrderStatusEnum.REJECTED);
            const cancelled = WorkOrderStatus.create(WorkOrderStatusEnum.CANCELLED);

            expect(awaiting.canTransitionTo(approved)).toBe(true);
            expect(awaiting.canTransitionTo(rejected)).toBe(true);
            expect(awaiting.canTransitionTo(cancelled)).toBe(true);
        });

        it('should allow valid transitions from APPROVED', () => {
            const approved = WorkOrderStatus.create(WorkOrderStatusEnum.APPROVED);
            const inProgress = WorkOrderStatus.create(WorkOrderStatusEnum.IN_PROGRESS);
            const completed = WorkOrderStatus.create(WorkOrderStatusEnum.COMPLETED);

            expect(approved.canTransitionTo(inProgress)).toBe(true);
            expect(approved.canTransitionTo(completed)).toBe(true);
        });

        it('should allow valid transitions from REJECTED', () => {
            const rejected = WorkOrderStatus.create(WorkOrderStatusEnum.REJECTED);
            const inProgress = WorkOrderStatus.create(WorkOrderStatusEnum.IN_PROGRESS);
            const cancelled = WorkOrderStatus.create(WorkOrderStatusEnum.CANCELLED);

            expect(rejected.canTransitionTo(inProgress)).toBe(true);
            expect(rejected.canTransitionTo(cancelled)).toBe(true);
        });

        it('should not allow transitions from terminal states', () => {
            const completed = WorkOrderStatus.create(WorkOrderStatusEnum.COMPLETED);
            const cancelled = WorkOrderStatus.create(WorkOrderStatusEnum.CANCELLED);
            const open = WorkOrderStatus.create(WorkOrderStatusEnum.OPEN);

            expect(completed.canTransitionTo(open)).toBe(false);
            expect(cancelled.canTransitionTo(open)).toBe(false);
        });

        it('should transition successfully when valid', () => {
            const open = WorkOrderStatus.create(WorkOrderStatusEnum.OPEN);
            const inProgress = WorkOrderStatus.create(WorkOrderStatusEnum.IN_PROGRESS);

            const newStatus = open.transitionTo(inProgress);
            expect(newStatus.value).toBe(WorkOrderStatusEnum.IN_PROGRESS);
        });

        it('should throw error when transition is invalid', () => {
            const open = WorkOrderStatus.create(WorkOrderStatusEnum.OPEN);
            const completed = WorkOrderStatus.create(WorkOrderStatusEnum.COMPLETED);

            expect(() => open.transitionTo(completed)).toThrow('Invalid transition from Aberta to Concluída');
        });
    });

    describe('Terminal States', () => {
        it('should identify terminal states', () => {
            expect(WorkOrderStatus.create(WorkOrderStatusEnum.COMPLETED).isTerminal()).toBe(true);
            expect(WorkOrderStatus.create(WorkOrderStatusEnum.CANCELLED).isTerminal()).toBe(true);
            expect(WorkOrderStatus.create(WorkOrderStatusEnum.OPEN).isTerminal()).toBe(false);
            expect(WorkOrderStatus.create(WorkOrderStatusEnum.IN_PROGRESS).isTerminal()).toBe(false);
        });
    });

    describe('Status Checks', () => {
        it('should check status types correctly', () => {
            expect(WorkOrderStatus.create(WorkOrderStatusEnum.OPEN).isOpen()).toBe(true);
            expect(WorkOrderStatus.create(WorkOrderStatusEnum.IN_PROGRESS).isInProgress()).toBe(true);
            expect(WorkOrderStatus.create(WorkOrderStatusEnum.AWAITING_APPROVAL).isAwaitingApproval()).toBe(true);
            expect(WorkOrderStatus.create(WorkOrderStatusEnum.APPROVED).isApproved()).toBe(true);
            expect(WorkOrderStatus.create(WorkOrderStatusEnum.COMPLETED).isCompleted()).toBe(true);
            expect(WorkOrderStatus.create(WorkOrderStatusEnum.CANCELLED).isCancelled()).toBe(true);
        });
    });

    describe('Equality', () => {
        it('should check equality correctly', () => {
            const status1 = WorkOrderStatus.create(WorkOrderStatusEnum.OPEN);
            const status2 = WorkOrderStatus.create(WorkOrderStatusEnum.OPEN);
            const status3 = WorkOrderStatus.create(WorkOrderStatusEnum.IN_PROGRESS);

            expect(status1.equals(status2)).toBe(true);
            expect(status1.equals(status3)).toBe(false);
        });
    });

    describe('Serialization', () => {
        it('should convert to JSON', () => {
            const status = WorkOrderStatus.create(WorkOrderStatusEnum.OPEN);
            const json = status.toJSON();
            expect(json.value).toBe('OPEN');
            expect(json.label).toBe('Aberta');
        });

        it('should convert to string', () => {
            const status = WorkOrderStatus.create(WorkOrderStatusEnum.OPEN);
            expect(status.toString()).toBe('OPEN');
        });
    });
});

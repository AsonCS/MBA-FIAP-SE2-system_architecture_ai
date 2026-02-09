export enum PriorityLevel {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
}

export class Priority {
    private readonly level: PriorityLevel;

    constructor(level: PriorityLevel = PriorityLevel.MEDIUM) {
        this.level = level;
    }

    getLevel(): PriorityLevel {
        return this.level;
    }

    isHigherThan(other: Priority): boolean {
        const order = {
            [PriorityLevel.LOW]: 1,
            [PriorityLevel.MEDIUM]: 2,
            [PriorityLevel.HIGH]: 3,
            [PriorityLevel.URGENT]: 4,
        };
        return order[this.level] > order[other.level];
    }

    equals(other: Priority): boolean {
        return this.level === other.level;
    }

    toString(): string {
        return this.level;
    }
}

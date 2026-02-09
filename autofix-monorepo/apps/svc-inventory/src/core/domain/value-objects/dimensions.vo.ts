/**
 * Dimensions Value Object
 * Represents physical dimensions of a product
 */
export class Dimensions {
    private readonly length: number;
    private readonly width: number;
    private readonly height: number;
    private readonly unit: string;

    private constructor(
        length: number,
        width: number,
        height: number,
        unit: string,
    ) {
        this.length = length;
        this.width = width;
        this.height = height;
        this.unit = unit;
    }

    static create(
        length: number,
        width: number,
        height: number,
        unit: string = 'cm',
    ): Dimensions {
        if (length <= 0 || width <= 0 || height <= 0) {
            throw new Error('All dimensions must be positive');
        }

        return new Dimensions(length, width, height, unit);
    }

    getLength(): number {
        return this.length;
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    getUnit(): string {
        return this.unit;
    }

    getVolume(): number {
        return this.length * this.width * this.height;
    }

    equals(other: Dimensions): boolean {
        return (
            this.length === other.length &&
            this.width === other.width &&
            this.height === other.height &&
            this.unit === other.unit
        );
    }

    toString(): string {
        return `${this.length}x${this.width}x${this.height} ${this.unit}`;
    }
}

/**
 * VehicleSnapshot Value Object
 * Stores immutable vehicle data at the time of work order creation
 * Ensures historical accuracy even if vehicle data changes later
 */
export interface VehicleSnapshotProps {
    vehicleId: string;
    licensePlate: string;
    make: string;
    model: string;
    year: number;
    vin?: string;
    color?: string;
    mileage?: number;
}

export class VehicleSnapshot {
    private readonly _props: VehicleSnapshotProps;

    private constructor(props: VehicleSnapshotProps) {
        this.validate(props);
        this._props = Object.freeze({ ...props });
    }

    static create(props: VehicleSnapshotProps): VehicleSnapshot {
        return new VehicleSnapshot(props);
    }

    private validate(props: VehicleSnapshotProps): void {
        if (!props.vehicleId || props.vehicleId.trim() === '') {
            throw new Error('Vehicle ID is required');
        }
        if (!props.licensePlate || props.licensePlate.trim() === '') {
            throw new Error('License plate is required');
        }
        if (!props.make || props.make.trim() === '') {
            throw new Error('Vehicle make is required');
        }
        if (!props.model || props.model.trim() === '') {
            throw new Error('Vehicle model is required');
        }
        if (!props.year || props.year < 1900 || props.year > new Date().getFullYear() + 1) {
            throw new Error('Invalid vehicle year');
        }
        if (props.mileage !== undefined && props.mileage < 0) {
            throw new Error('Mileage cannot be negative');
        }
    }

    get vehicleId(): string {
        return this._props.vehicleId;
    }

    get licensePlate(): string {
        return this._props.licensePlate;
    }

    get make(): string {
        return this._props.make;
    }

    get model(): string {
        return this._props.model;
    }

    get year(): number {
        return this._props.year;
    }

    get vin(): string | undefined {
        return this._props.vin;
    }

    get color(): string | undefined {
        return this._props.color;
    }

    get mileage(): number | undefined {
        return this._props.mileage;
    }

    get fullName(): string {
        return `${this._props.year} ${this._props.make} ${this._props.model}`;
    }

    toJSON(): VehicleSnapshotProps {
        return { ...this._props };
    }

    static fromJSON(data: VehicleSnapshotProps): VehicleSnapshot {
        return VehicleSnapshot.create(data);
    }
}

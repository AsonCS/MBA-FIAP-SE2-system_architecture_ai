import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IHasher } from '@core/ports/hasher.port';

@Injectable()
export class BcryptHasher implements IHasher {
    private readonly saltRounds = 10;

    async hash(plainText: string): Promise<string> {
        return bcrypt.hash(plainText, this.saltRounds);
    }

    async compare(plainText: string, hashedText: string): Promise<boolean> {
        return bcrypt.compare(plainText, hashedText);
    }
}

import {Injectable} from "@nestjs/common";
import {assertTrue} from "../../lib/panic";
import * as crypto from "node:crypto";
import {Random as Random$} from 'random'


@Injectable()
export abstract class RandomProvider {
    abstract int32(n: number): number;

    abstract uuid(): string;

    abstract salt(): string;
}

export class DefaultRandomProvider extends RandomProvider {
    override int32(n: number): number {
        assertTrue(n < 4294967296, "n must be less than 4294967296");
        assertTrue(n > 0, "n must be greater than 0");

        return Math.floor(Math.random() * n);
    }

    override uuid(): string {
        return crypto.randomUUID();
    }

    override salt(): string {
        return crypto.randomBytes(16).toString('hex');
    }
}

export class SeedRandomProvider extends RandomProvider {
    constructor(seed: string | number) {
        super();
        this.rng = new Random$(seed);
    }

    private rng: Random$;

    override int32(n: number): number {
        assertTrue(n < 4294967296, "n must be less than 4294967296");
        assertTrue(n > 0, "n must be greater than 0");
        return this.rng.int(0, n + 1);
    }

    override uuid(): string {
        const selectAll = (n: number, chars: string): string => {
            let result = '';
            for (let i = 0; i < n; i++) {
                result += chars[this.rng.int(0, chars.length)];
            }
            return result;
        }
        // UUID: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
        const x = (n: number) => selectAll(n, '0123456789abcdef');
        const y = selectAll(1, '89ab');
        return `${x(4)}${x(4)}-${x(4)}-4${x(3)}-${y}${x(3)}-${x(12)}`;
    }

    override salt(): string {
        const size = 16;
        const array = new Uint8Array(size);
        for (let i = 0; i < size; i++) {
            array[i] = this.rng.int(0, 255);
        }
        return Buffer.from(array).toString('hex');
    }
}

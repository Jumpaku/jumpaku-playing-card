import {Injectable} from "@nestjs/common";
import {assertTrue} from "../../panic";
import * as crypto from "node:crypto";
import {Random as Random$} from 'random'


@Injectable()
export abstract class RandomProviderToken {
    abstract int32(n: number): number;

    abstract uuid(): string;
}

export class RandomProvider extends RandomProviderToken {
    override int32(n: number): number {
        assertTrue(n < 4294967296, "n must be less than 4294967296");
        assertTrue(n > 0, "n must be greater than 0");

        return Math.floor(Math.random() * n);
    }

    override uuid(): string {
        return crypto.randomUUID();
    }
}

export class RandomProviderWithSeed extends RandomProviderToken {
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
}

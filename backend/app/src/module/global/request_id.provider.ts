import {Injectable} from "@nestjs/common";
import {RandomProvider} from "./random.provider";
import {Request} from "express";

@Injectable()
export class RequestIdProvider {
    constructor(private readonly random: RandomProvider) {
    }

    provide(req: Request) {
        (req as any).requestId = this.random.uuid();
    }

    extract(req: Request): string {
        return (req as any).requestId;
    }
}

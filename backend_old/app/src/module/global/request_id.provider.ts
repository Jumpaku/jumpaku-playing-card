import {Injectable} from "@nestjs/common";
import {RandomProvider} from "./random.provider";
import {Request} from "express";

@Injectable()
export class RequestIdProvider {
    constructor(private readonly random: RandomProvider) {
    }

    extract(req: Request): string {
        let got = (req as any).requestId;
        if (got == null) {
            got = (req as any).requestId = this.random.uuid();
        }
        return got;
    }
}

import {Injectable} from "@nestjs/common";
import {Request} from "express";

@Injectable()
export abstract class RequestTimeProvider {
    abstract extract(req: Request): Date
}

@Injectable()
export class RealRequestTimeProvider extends RequestTimeProvider {
    override extract(req: Request): Date {
        let got = (req as any).requestTime;
        if (got == null) {
            got = (req as any).requestTime = new Date();
        }
        return got;
    }
}

@Injectable()
export class ModifiableRequestTimeProvider extends RequestTimeProvider {
    constructor(private readonly base: RequestTimeProvider) {
        super();
    }
    override extract(req: Request): Date {
        const debugId = req.cookies[COOKIE_NAME_DEBUG_ID];
        if (debugId == null) {
            return this.base.extract(req);
        }

        let got = (req as any).requestTime;
        if (got == null) {
            got = (req as any).requestTime = new Date();
        }
        return got;
    }
}
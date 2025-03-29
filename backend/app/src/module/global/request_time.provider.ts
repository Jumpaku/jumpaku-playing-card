import {Injectable, Scope} from "@nestjs/common";
import {Request} from "express";

@Injectable()
export abstract class RequestTimeProvider {
    abstract provide(req: Request): void
    abstract extract(req: Request): Date
}

@Injectable()
export class RealRequestTimeProvider extends RequestTimeProvider {
    override provide(req: Request): void {
        (req as any).requestTime = new Date();
    }
    override extract(req: Request): Date {
        const t = (req as any).requestTime;
        if (t == null) {
            this.provide(req);
        }
        return (req as any).requestTime;
    }
}

@Injectable()
export class ModifiableRequestTimeProvider extends RequestTimeProvider {
    constructor(private readonly base: RequestTimeProvider) {
        super();
    }
    override provide(req: Request): void {
        const debugId = req.cookies[COOKIE_NAME_DEBUG_ID];
        if (debugId == null) {
            return this.base.provide(req);
        }
        (req as any).requestTime = new Date();
    }
    override extract(req: Request): Date {
        return this.base.extract(req);
    }
}
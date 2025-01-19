import {Injectable, Scope} from "@nestjs/common";

@Injectable({scope: Scope.REQUEST})
export abstract class RequestTimeProviderToken {
    abstract requestTime(modificationId: string): Date
}

@Injectable({scope: Scope.REQUEST})
export class RequestTimeProvider extends RequestTimeProviderToken {
    private readonly _requestTime: Date;

    constructor() {
        super();
        this._requestTime = new Date();
    }

    override requestTime(modificationId: string): Date {
        return this._requestTime;
    }
}

@Injectable({scope: Scope.REQUEST})
export class ModifiedRequestTimeProvider extends RequestTimeProviderToken {
    private readonly _requestTime: Date;

    constructor() {
        super();
        this._requestTime = new Date();
    }

    override requestTime(modificationId: string): Date {
        return this._requestTime;
    }
}
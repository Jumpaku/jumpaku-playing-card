import {Injectable, Scope} from "@nestjs/common";
import {RandomProviderToken} from "./random.provider";

@Injectable({scope: Scope.REQUEST})
export class RequestIdProvider {
    constructor(random: RandomProviderToken) {
        this._requestId = random.uuid();
    }

    private readonly _requestId: string;

    requestId(): string {
        return this._requestId;
    }
}

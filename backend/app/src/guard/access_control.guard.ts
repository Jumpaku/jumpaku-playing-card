import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import {extractAccessControl} from "../gen/pb/api/v1/access_control.decorator";
import {Request} from "express";
import {ConfigProvider} from "../module/global/config.provider";
import {verifyJWT} from "../lib/jwt";
import {RequestTimeProviderToken} from "../module/global/request_time.provider";
import {Observable} from "rxjs";

@Injectable()
export class AccessControlGuard implements CanActivate {
    constructor(
        private readonly config: ConfigProvider,
        private readonly requestTime: RequestTimeProviderToken,
    ) {
    }

    canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const accessControl = extractAccessControl(ctx);
        if (accessControl == null) {
            return true;
        }

        const req = ctx.switchToHttp().getRequest<Request>();
        const a = req.headers.authorization;
        if (a == null) {
            return false;
        }
        if (!a.startsWith("Bearer") && !a.startsWith("bearer")) {
            return false;
        }

        const jwt = a.slice('Bearer'.length).trim();
        try {
            verifyJWT(jwt, this.config.get().auth!.publicKey, {
                timestamp: this.requestTime.requestTime(''),
                issuers:[this.config.get().auth!.issuer],
            });
        } catch (e) {
            return false;
        }
        return true;
    }
}

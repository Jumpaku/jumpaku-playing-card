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
        if (accessControl.require.length === 0) {
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
            verifyJWT(jwt, this.config.get().authentication!.publicKey, {
                algorithms: [this.config.get().authentication!.algorithm as any],
                timestamp: this.requestTime.requestTime(''),
                issuers: [this.config.get().authentication!.issuer],
            });
        } catch (e) {
            return false;
        }
        return true;
    }
}

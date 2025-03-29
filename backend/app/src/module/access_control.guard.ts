import {Injectable, CanActivate, ExecutionContext, Inject} from '@nestjs/common';
import {extractAccessControl} from "../gen/pb/api/v1/access_control.decorator";
import {Request} from "express";
import {ConfigProvider} from "./global/config.provider";
import {verifyJWT} from "../lib/jwt";
import {RequestTimeProvider} from "./global/request_time.provider";
import {Observable} from "rxjs";
import {AccessTokenPayloadJson} from "../gen/pb/api/v1/jwt_pb";

@Injectable()
export class AccessControlGuard implements CanActivate {
    constructor(
        private readonly config: ConfigProvider,
        private readonly requestTime: RequestTimeProvider,
    ) {
    }

    canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const accessControl = extractAccessControl(ctx);
        if (accessControl == null || (accessControl.require?.length ?? 0) === 0) {
            return true;
        }

        const req = ctx.switchToHttp().getRequest<Request>();
        const a = req.headers.authorization;
        if (a == null || !(a.startsWith("Bearer") || a.startsWith("bearer"))) {
            return false;
        }
        const jwt = a.slice('Bearer'.length).trim();

        let accessToken: AccessTokenPayloadJson;
        const configAuth = this.config.get().authentication!;
        try {
            accessToken = verifyJWT<AccessTokenPayloadJson>(jwt, configAuth.publicKey, {
                algorithms: [configAuth.algorithm as any],
                timestamp: this.requestTime.extract(req),
                issuers: [configAuth.issuer],
                audiences: [configAuth.audience],
            });
        } catch (e) {
            return false;
        }

        const scopes = accessToken.data?.scopes ?? [];
        for (const r of accessControl.require) {
            if (!scopes.some(s => s === r || r.startsWith(`${s}:`))) {
                return false;
            }
        }

        return true;
    }
}

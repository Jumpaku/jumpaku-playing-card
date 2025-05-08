import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import {extractAccessControl} from "../gen/pb/api/v1/access_control.decorator";
import {Request} from "express";
import {ConfigProvider} from "./global/config.provider";
import {decodeJWT, verifyJWT} from "../lib/jwt";
import {RequestTimeProvider} from "./global/request_time.provider";
import {Observable} from "rxjs";
import {JwtPayload_JwtKind, JwtPayload_JwtKindSchema, JwtPayloadJson} from "../gen/pb/api/v1/jwt_pb";
import {TokenExpiredError} from "jsonwebtoken";
import {enumToJson} from "@bufbuild/protobuf";
import {throwAccessTokenExpired, throwRefreshTokenExpired} from "../exception/exception";

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
        const res = ctx.switchToHttp().getResponse<Request>();
        const a = req.headers.authorization;
        if (a == null || !(a.startsWith("Bearer") || a.startsWith("bearer"))) {
            return false;
        }
        const jwt = a.slice('Bearer'.length).trim();

        let payload: JwtPayloadJson;
        const configAuth = this.config.get().authentication!;
        try {
            payload = verifyJWT<JwtPayloadJson>(jwt, configAuth.publicKey, {
                algorithms: [configAuth.algorithm as any],
                timestamp: this.requestTime.extract(req),
                issuers: [configAuth.issuer],
                audiences: [configAuth.audience],
            });
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                const payload = decodeJWT<JwtPayloadJson>(jwt);
                if (payload?.kind === enumToJson(JwtPayload_JwtKindSchema, JwtPayload_JwtKind.ACCESS)) {
                    throwAccessTokenExpired("Access token expired", "Access token expired");
                }
                if (payload?.kind === enumToJson(JwtPayload_JwtKindSchema, JwtPayload_JwtKind.REFRESH)) {
                    throwRefreshTokenExpired("Refresh token expired", "Refresh token expired");
                }
                return false;
            }
            return false;
        }

        const scopes = (payload.kind === "JWT_KIND_ACCESS") ? (payload.accessData?.scopes ?? []) :
            (payload.kind === "JWT_KIND_REFRESH") ? (payload.refreshData?.scopes ?? []) :
                [];
        for (const r of accessControl.require) {
            if (!scopes.some(s => s === r || r.startsWith(`${s}:`))) {
                return false;
            }
        }

        (req as any).jwtPayload = payload;

        return true;
    }
}

import {Request} from "express";
import {
    AccessTokenPayload_Data, AccessTokenPayload_DataSchema,
    AccessTokenPayloadJson,
    AccessTokenPayloadSchema,
    RefreshTokenPayload_Data, RefreshTokenPayload_DataSchema,
    RefreshTokenPayloadSchema
} from "../../../../../../gen/pb/api/v1/jwt_pb";
import {create, fromJson, toJson} from "@bufbuild/protobuf";
import {Injectable} from "@nestjs/common";
import {ConfigProvider} from "../../../../../global/config.provider";
import {issueJWT, verifyJWT} from "../../../../../../lib/jwt";
import {date, duration, instant} from "../../../../../../lib/temporal";

export function extractJWT(req: Request): string | null {
    const a = req.headers.authorization;
    if (a == null) {
        return null;
    }
    if (!a.startsWith("Bearer") && !a.startsWith("bearer")) {
        return null;
    }

    return a.slice('Bearer'.length).trim();
}


@Injectable()
export class JwtProvider {
    constructor(private config: ConfigProvider) {
    }

    verifyAccessToken(jwt: string, verifyTime: Date): AccessTokenPayload_Data {
        const configAuth = this.config.get().authentication!;
        const payload = verifyJWT<AccessTokenPayloadJson>(jwt, configAuth.publicKey, {
            algorithms: [configAuth.algorithm as any],
            timestamp: verifyTime,
            issuers: [configAuth.issuer],
            audiences: [configAuth.audience],
        });
        return fromJson(AccessTokenPayloadSchema, payload).data ?? create(AccessTokenPayload_DataSchema);
    }

    issueAccessToken(payloadData: AccessTokenPayload_Data, issueTime: Date): string {
        const configAuth = this.config.get().authentication!;
        const exp = date(instant(issueTime).add(duration(configAuth.accessExpireSeconds)));
        const data = toJson(AccessTokenPayload_DataSchema, payloadData);
        return issueJWT({data: data}, configAuth.secretKey, {
            algorithm: configAuth.algorithm as any,
            issuedAt: issueTime,
            expiresAt: exp,
            audience: configAuth.audience,
            issuer: configAuth.issuer,
        });
    }

    verifyRefreshToken(jwt: string, verifyTime: Date): RefreshTokenPayload_Data {
        const configAuth = this.config.get().authentication!;
        const payload = verifyJWT<AccessTokenPayloadJson>(jwt, configAuth.publicKey, {
            algorithms: [configAuth.algorithm as any],
            timestamp: verifyTime,
            issuers: [configAuth.issuer],
            audiences: [configAuth.audience],
        });
        return fromJson(RefreshTokenPayloadSchema, payload).data ?? create(RefreshTokenPayload_DataSchema);
    }

    issueRefreshToken(payloadData: RefreshTokenPayload_Data, expireTime: Date, issueTime: Date): string {
        const configAuth = this.config.get().authentication!;
        const data = toJson(RefreshTokenPayload_DataSchema, payloadData);
        return issueJWT({data: data}, configAuth.secretKey, {
            algorithm: configAuth.algorithm as any,
            issuedAt: issueTime,
            expiresAt: expireTime,
            audience: configAuth.audience,
            issuer: configAuth.issuer,
        });
    }
}
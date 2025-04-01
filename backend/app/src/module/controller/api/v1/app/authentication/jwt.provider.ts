import {
    JwtPayload_AccessData, JwtPayloadSchema,
    JwtPayload_RefreshData, JwtPayload_JwtKind
} from "../../../../../../gen/pb/api/v1/jwt_pb";
import {create, toJson} from "@bufbuild/protobuf";
import {Injectable} from "@nestjs/common";
import {ConfigProvider} from "../../../../../global/config.provider";
import {issueJWT} from "../../../../../../lib/jwt";
import {date, duration, instant} from "../../../../../../lib/temporal";

@Injectable()
export class JwtProvider {
    constructor(private config: ConfigProvider) {
    }

    issueAccessToken(payloadData: JwtPayload_AccessData, issueTime: Date): string {
        const configAuth = this.config.get().authentication!;
        const exp = date(instant(issueTime).add(duration(configAuth.accessExpireSeconds)));
        const payload = toJson(JwtPayloadSchema, create(JwtPayloadSchema, {
            kind: JwtPayload_JwtKind.ACCESS,
            accessData: payloadData,
        }));
        return issueJWT(payload, configAuth.secretKey, {
            algorithm: configAuth.algorithm as any,
            issuedAt: issueTime,
            expiresAt: exp,
            audience: configAuth.audience,
            issuer: configAuth.issuer,
        });
    }

    issueRefreshToken(payloadData: JwtPayload_RefreshData, expireTime: Date, issueTime: Date): string {
        const configAuth = this.config.get().authentication!;
        const payload = toJson(JwtPayloadSchema,create(JwtPayloadSchema, {
            kind: JwtPayload_JwtKind.REFRESH,
            refreshData: payloadData,
        }));
        return issueJWT(payload, configAuth.secretKey, {
            algorithm: configAuth.algorithm as any,
            issuedAt: issueTime,
            expiresAt: expireTime,
            audience: configAuth.audience,
            issuer: configAuth.issuer,
        });
    }
}
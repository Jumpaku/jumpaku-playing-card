import {Injectable} from "@nestjs/common";
import {Request} from "express";
import {JwtPayloadJson} from "../../gen/pb/api/v1/jwt_pb";
import {throwBadRequest} from "../../exception/exception";

@Injectable()
export class RequestSessionProvider {
    extract(req: Request): string | null {
        const payload = (req as any).jwtPayload as JwtPayloadJson;
        return payload?.accessData?.sessionId ?? null;
    }
    mustExtract(req: Request): string {
        const sessionId = this.extract(req);
        if (sessionId == null) {
            throwBadRequest("session id not found", "Session ID not found in JWT payload");
        }
        return sessionId;
    }
    extractRefresh(req: Request): string | null {
        const payload = (req as any).jwtPayload as JwtPayloadJson;
        return payload?.refreshData?.sessionId ?? null;
    }
    mustExtractRefresh(req: Request): string {
        const sessionId = this.extractRefresh(req);
        if (sessionId == null) {
            throwBadRequest("session id not found", "Session ID not found in JWT payload");
        }
        return sessionId;
    }
}

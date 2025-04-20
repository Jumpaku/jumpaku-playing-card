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
        const payload = (req as any).jwtPayload as JwtPayloadJson;
        const sessionId = payload?.accessData?.sessionId;
        if (sessionId == null) {
            throwBadRequest("session id not found", "Session ID not found in JWT payload");
        }
        return sessionId;
    }
}

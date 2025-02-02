import {Algorithm, sign, verify} from "jsonwebtoken";

export class JwtPayload {
    constructor(payload: Record<string, unknown>) {
        Object.assign(this, payload);
    }

    readonly [key: string]: unknown;

    exp: string;
    nbf?: string;
    iss?: string;
    aud?: string | RegExp;
    sub?: string;
}

export function verifyJWT(jwt: string, pubKey: string, params: {
    timestamp: Date,
    issuers?: string[],
    audiences?: string | RegExp[],
    subject?: string,
}): JwtPayload {
    const payload = verify(jwt, pubKey, {
        issuer: params.issuers,
        audience: params.audiences,
        subject: params.subject,
        clockTimestamp: params.timestamp.getTime() / 1000,
    });
    if(typeof payload === 'string') {
        throw new Error('string payload not supported');
    }
    return new JwtPayload(payload);
}

export function issueJWT<P extends {}>(payload: P, secKey: string, params: {
    algorithm: Algorithm,
    issuedAt: Date,
    expiresIn?: Date,
    notBefore?: Date,
    issuer?: string,
    audience?: string,
    subject?: string,
}): string {
    return sign({
        ...payload,
        iat: Math.floor(params.issuedAt.getTime() / 1000),
    }, secKey, {
        algorithm: params.algorithm,
        audience: params.audience,
        issuer: params.issuer,
        subject: params.subject,
        expiresIn: params.expiresIn == null ? undefined : Math.floor(params.expiresIn.getTime() / 1000),
        notBefore: params.notBefore == null ? undefined : Math.floor(params.notBefore.getTime() / 1000),
    });
}

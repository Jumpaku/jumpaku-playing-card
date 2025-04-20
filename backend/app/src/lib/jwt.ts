import {Algorithm, sign, verify, VerifyOptions} from "jsonwebtoken";
import {instant} from "./temporal";

export function verifyJWT<P extends {}>(jwt: string, pubKey: string, params: {
    timestamp: Date,
    algorithms: Exclude<Algorithm, "none">[],
    issuers?: string[],
    audiences?: (string | RegExp)[],
    subject?: string,
}): P {
    const options: VerifyOptions = {algorithms: params.algorithms, clockTimestamp: params.timestamp.getTime() / 1000};
    if (params.issuers != null) {
        Object.assign(options, {issuer: params.issuers});
    }
    if (params.audiences != null) {
        Object.assign(options, {audience: params.audiences});
    }
    if (params.subject != null) {
        Object.assign(options, {subject: params.subject});
    }
    const payload = verify(jwt, pubKey, options);
    if (typeof payload === 'string') {
        throw new Error('string payload not supported');
    }
    return payload as P;
}

export function issueJWT<P extends {}>(payload: P, secKey: string, params: {
    algorithm: Exclude<Algorithm, 'none'>,
    issuedAt: Date,
    expiresAt?: Date,
    notBefore?: Date,
    issuer?: string,
    audience?: string | string[],
    subject?: string,
}): string {
    const options = {algorithm: params.algorithm};
    if (params.audience != null) {
        Object.assign(options, {audience: params.audience});
    }
    if (params.issuer != null) {
        Object.assign(options, {issuer: params.issuer});
    }
    if (params.subject != null) {
        Object.assign(options, {subject: params.subject});
    }
    if (params.expiresAt != null) {
        Object.assign(options, {expiresIn: Math.floor((params.expiresAt.getTime() - params.issuedAt.getTime()) / 1000)});
    }
    return sign({...payload, iat: instant(params.issuedAt).epochSeconds,}, secKey, options);
}

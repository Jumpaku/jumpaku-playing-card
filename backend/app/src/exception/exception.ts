import {HttpStatus} from "@nestjs/common";
import {
    ErrorResponse_ErrorCode,
    ErrorResponseJson,
    ErrorResponseSchema
} from "../gen/pb/api/v1/error_pb";
import {create, toJson} from "@bufbuild/protobuf";


function appendStack(err: Error, cause?: unknown): string {
    const thisStack = err.stack ?? `${this.name}: ${this.message}\n No stacktrace.`;
    if (cause == null || cause === '') {
        return thisStack;
    }
    if (cause instanceof Error) {
        return thisStack + `\nCaused by: ${cause.stack}`
    }
    return thisStack + `\nCaused by: ${cause}`
}

export class AppException extends Error {
    constructor(
        readonly statusCode: number,
        readonly statusMessage: string,
        readonly resBody: ErrorResponseJson,
        readonly logDetails: string,
        readonly cause?: unknown,
    ) {
        super(statusMessage);
        this.name = this.constructor.name;
        this.stack = appendStack(this, cause);
    }
}

export function throwBadRequest(description: string, details: string, options?: {
    responseData?: Record<string, string>;
    cause?: unknown;
}): never {
    throw new AppException(
        HttpStatus.BAD_REQUEST,
        'Bad request',
        toJson(ErrorResponseSchema, create(ErrorResponseSchema, {
            errorCode: ErrorResponse_ErrorCode.BAD_REQUEST,
            errorDescription: description,
            data: options?.responseData,
        })),
        details,
        options?.cause,
    );
}

export function throwUnauthorized(description: string, details: string, options?: {
    responseData?: Record<string, string>;
    cause?: unknown;
}): never {
    throw new AppException(
        HttpStatus.UNAUTHORIZED,
        'Unauthorized',
        toJson(ErrorResponseSchema, create(ErrorResponseSchema, {
            errorCode: ErrorResponse_ErrorCode.UNAUTHORIZED,
            errorDescription: description,
            data: options?.responseData,
        })),
        details,
        options?.cause,
    );
}

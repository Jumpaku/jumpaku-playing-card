import {ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Injectable} from '@nestjs/common';
import {Request, Response} from 'express';
import {LoggerProvider} from "./global/logger.provider";
import {AppException} from "../exception/exception";
import {ErrorResponse_ErrorCode, ErrorResponseJson, ErrorResponseSchema} from "../gen/pb/api/v1/error_pb";
import {create, toJson} from "@bufbuild/protobuf";

export type ErrorLogEntry = {
    log: 'error';
    time: string;
    message: string;
    error: {
        request: {
            method: string;
            url: string;
        };
        response: {
            statusCode: number;
            statusMessage: string;
            resBody: ErrorResponseJson;
        };
        details: string;
        stack: string;
    };
}

@Catch(Error)
@Injectable()
export class AppExceptionFilter implements ExceptionFilter<AppException> {
    constructor(private readonly logger: LoggerProvider) {
    }

    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();

        this.logger.log((exception as AppException).stack);

        if (!(exception instanceof AppException)) {
            const resInfo = {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                statusMessage: 'Internal server error',
                resBody: toJson(ErrorResponseSchema, create(ErrorResponseSchema, {
                    errorCode: ErrorResponse_ErrorCode.UNKNOWN,
                    errorDescription: 'Unknown server error',
                })),
            }
            const logEntry: ErrorLogEntry = {
                log: 'error',
                time: new Date().toISOString(),
                message: exception.message,
                error: {
                    request: {
                        method: req.method,
                        url: req.url,
                    },
                    response: resInfo,
                    details: '',
                    stack: exception.stack ?? `${exception.name}: ${exception.message}\n No stacktrace.`,
                },
            }

            this.logger.error(JSON.stringify(logEntry));

            res.statusMessage = resInfo.statusMessage;
            res.status(resInfo.statusCode)
                .json(resInfo.resBody);
            return;
        }
        const resBody = exception.resBody;

        const logEntry: ErrorLogEntry = {
            log: 'error',
            time: new Date().toISOString(),
            message: exception.message,
            error: {
                request: {
                    method: req.method,
                    url: req.url,
                },
                response: {
                    statusCode: exception.statusCode,
                    statusMessage: HttpStatus[exception.statusCode],
                    resBody: resBody,
                },
                details: exception.logDetails,
                stack: exception.stack!,
            },
        };

        switch (exception.statusCode) {
            case HttpStatus.BAD_REQUEST:
                this.logger.log(JSON.stringify(logEntry));
                break;
            default:
                this.logger.error(JSON.stringify(logEntry));
                break;
        }

        res.statusMessage = exception.statusMessage;
        res.status(exception.statusCode)
            .json(resBody);
    }
}

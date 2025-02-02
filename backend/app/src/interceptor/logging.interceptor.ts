import {Injectable, NestInterceptor, ExecutionContext, CallHandler} from '@nestjs/common';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Request, Response} from "express";
import * as process from "node:process";
import {LoggerProvider} from "../module/global/logger.provider";


function nowNano(): bigint {
    const [seconds, nanoseconds] = process.hrtime();
    return BigInt(seconds) * BigInt(1e9) + BigInt(nanoseconds);
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: LoggerProvider) {
    }

    intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        const start = nowNano();

        const controller = ctx.getClass().name;
        const http = ctx.switchToHttp();
        const req = http.getRequest<Request>();
        const reqBody = JSON.stringify(req.body);
        const res = http.getResponse<Response>();
        return next.handle().pipe(
            tap((resBody) => {
                this.logger.log(JSON.stringify({
                    log: 'rpc',
                    time: new Date(now).toISOString(),
                    message: 'rpc call',
                    rpc: {
                        controller,
                        durationSeconds: Number(nowNano() - start) * 1e-9,
                        request: {
                            ip: req.ip,
                            protocol: req.protocol,
                            method: req.method,
                            hostname: req.hostname,
                            path: req.path,
                            query: req.query,
                            headers: req.headers,
                            body: reqBody,
                        },
                        response: {
                            statusCode: res.statusCode,
                            statusText: res.statusMessage,
                            headers: res.getHeaders(),
                            body: JSON.stringify(resBody),
                        },
                    },
                }))
            }),
        );
    }
}

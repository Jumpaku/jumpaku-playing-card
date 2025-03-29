import {Injectable, NestInterceptor, ExecutionContext, CallHandler} from '@nestjs/common';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Request, Response} from "express";
import * as process from "node:process";
import {LoggerProvider} from "./global/logger.provider";
import {RequestIdProvider} from "./global/request_id.provider";
import {RequestTimeProvider} from "./global/request_time.provider";


@Injectable()
export class RequestInterceptor implements NestInterceptor {
    constructor(
        private readonly requestId: RequestIdProvider,
        private readonly requestTime: RequestTimeProvider,
    ) {
    }

    intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
        const http = ctx.switchToHttp();
        const req = http.getRequest<Request>();
        this.requestId.provide(req);
        this.requestTime.provide(req);
        return next.handle();
    }
}

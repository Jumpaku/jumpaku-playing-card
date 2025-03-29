import {Module} from '@nestjs/common';
import {ExampleModule} from "./controller/api/v1/example/example.module";
import {PlaygroundModule} from "./controller/api/debug/playground/playground.module";
import {AuthenticationModule} from "./controller/api/v1/app/authentication/authentication.module";
import {GlobalModule} from "./global/global.module";
import {APP_FILTER, APP_GUARD, APP_INTERCEPTOR} from "@nestjs/core";
import {AccessControlGuard} from "./access_control.guard";
import {LoggingInterceptor} from "./logging.interceptor";
import {AppExceptionFilter} from "./exception.filter";
import {RequestInterceptor} from "./request.interceptor";

@Module({
    imports: [
        GlobalModule,
        PlaygroundModule,
        ExampleModule,
        AuthenticationModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AccessControlGuard,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: RequestInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: AppExceptionFilter,
        },
    ],
})
export class AppModule {
}


import {Module} from '@nestjs/common';
import {ExampleModule} from "./controller/api/v1/example/example.module";
import {PlaygroundModule} from "./controller/api/debug/playground/playground.module";
import {AuthenticationModule} from "./controller/api/v1/app/authentication/authentication.module";
import {APP_FILTER, APP_GUARD, APP_INTERCEPTOR} from "@nestjs/core";
import {AccessControlGuard} from "../guard/access_control.guard";
import {LoggingInterceptor} from "../interceptor/logging.interceptor";
import {AppExceptionFilter} from "../filter/exception.filter";

@Module({
    providers: [
        {
            provide: APP_GUARD,
            useClass: AccessControlGuard,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: AppExceptionFilter,
        }
    ],
    imports: [
        PlaygroundModule,
        ExampleModule,
        AuthenticationModule,
    ],
})
export class AppModule {
}

import {Global, Module} from '@nestjs/common';
import {RequestIdProvider} from "./request_id.provider";
import {ConfigProvider} from "./config.provider";
import {RandomProvider, RandomProviderToken} from "./random.provider";
import {RequestTimeProvider, RequestTimeProviderToken} from "./request_time.provider";
import {LoggerProvider} from "./logger.provider";
import {PostgresProvider} from "./postgres.provider";

@Global()
@Module({
    providers: [
        LoggerProvider,
        {
            provide: ConfigProvider,
            useFactory: () => ConfigProvider.load("config/local.json"),
        },
        {
            provide: RandomProviderToken,
            useClass: RandomProvider,
        },
        RequestIdProvider,
        {
            provide: RequestTimeProviderToken,
            useClass: RequestTimeProvider,
        },
        PostgresProvider,
    ],
    exports: [
        LoggerProvider,
        ConfigProvider,
        RandomProviderToken,
        RequestIdProvider,
        RequestTimeProviderToken,
        PostgresProvider,
    ],
})
export class GlobalModule {
}

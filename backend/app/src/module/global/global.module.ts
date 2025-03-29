import {Global, Module} from '@nestjs/common';
import {RequestIdProvider} from "./request_id.provider";
import {ConfigProvider} from "./config.provider";
import {DefaultRandomProvider, RandomProvider} from "./random.provider";
import {RealRequestTimeProvider, RequestTimeProvider} from "./request_time.provider";
import {LoggerProvider} from "./logger.provider";
import {PostgresProvider} from "./postgres.provider";
import {mustGetEnv} from "../../lib/env";

@Global()
@Module({
    providers: [
        LoggerProvider,
        {
            provide: ConfigProvider,
            useFactory: () => ConfigProvider.load(mustGetEnv("CONFIG_PATH")),
        },
        {
            provide: RandomProvider,
            useClass: DefaultRandomProvider,
        },
        RequestIdProvider,
        {
            provide: RequestTimeProvider,
            useClass: RealRequestTimeProvider,
        },
        PostgresProvider,
    ],
    exports: [
        LoggerProvider,
        ConfigProvider,
        RandomProvider,
        RequestIdProvider,
        RequestTimeProvider,
        PostgresProvider,
    ],
})
export class GlobalModule {
}

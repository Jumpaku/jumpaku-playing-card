import {Global, Module} from '@nestjs/common';
import {RequestIdProvider} from "./request_id.provider";
import {ConfigProvider} from "./config.provider";
import {DefaultRandomProvider, RandomProvider} from "./random.provider";
import {RealRequestTimeProvider, RequestTimeProvider} from "./request_time.provider";
import {LoggerProvider} from "./logger.provider";
import {PostgresProvider} from "./postgres.provider";
import {mustGetEnv} from "../../lib/env";
import {RequestSessionProvider} from "./request_session.provider";

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
        RequestSessionProvider,
    ],
    exports: [
        LoggerProvider,
        ConfigProvider,
        RandomProvider,
        RequestIdProvider,
        RequestTimeProvider,
        PostgresProvider,
        RequestSessionProvider,
    ],
})
export class GlobalModule {
}

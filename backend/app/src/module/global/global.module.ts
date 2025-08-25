import { Global, Module } from '@nestjs/common';
import { RequestIdProvider } from './request_id.provider';
import { ConfigProvider } from './config.provider';
import { DefaultRandomProvider, RandomProvider } from './random.provider';
import {
  RealRequestTimeProvider,
  RequestTimeProvider,
} from './request_time.provider';
import { LoggerProvider } from './logger.provider';
import { mustGetEnv } from '../../lib/env';
import { EnvProvider } from './env.provider';

@Global()
@Module({
  providers: [
    LoggerProvider,
    {
      provide: ConfigProvider,
      useFactory: () => ConfigProvider.load(mustGetEnv('CONFIG_PATH')),
    },
    {
      provide: EnvProvider,
      useFactory: () => EnvProvider.load(),
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
  ],
  exports: [
    LoggerProvider,
    ConfigProvider,
    EnvProvider,
    RandomProvider,
    RequestIdProvider,
    RequestTimeProvider,
  ],
})
export class GlobalModule {}

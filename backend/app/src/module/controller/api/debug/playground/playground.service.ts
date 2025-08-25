import e from 'express';
import { RandomProvider } from '../../../../global/random.provider';
import { Inject } from '@nestjs/common';
import { RequestIdProvider } from '../../../../global/request_id.provider';
import { RequestTimeProvider } from '../../../../global/request_time.provider';
import { ConfigProvider } from '../../../../global/config.provider';
import { toJson } from '@bufbuild/protobuf';
import { AppConfigSchema } from '../../../../../gen/pb/config/config_pb';
import { LoggerProvider } from '../../../../global/logger.provider';

export class PlaygroundService {
  @Inject() private logger: LoggerProvider;
  @Inject() private config: ConfigProvider;
  @Inject() private random: RandomProvider;
  @Inject() private requestId: RequestIdProvider;
  @Inject() private requestTime: RequestTimeProvider;

  async playground(req: e.Request, res: e.Response): Promise<any> {
    this.config.reload('config/local.json');

    this.logger.debug('playground debug log');
    this.logger.log('playground log log');
    this.logger.warn('playground warn log');
    this.logger.error('playground error log');

    return {
      config: toJson(AppConfigSchema, this.config.get()),
      random: this.random.int32(10),
      requestId: this.requestId.extract(req),
      requestTime: this.requestTime.extract(req),
      message: 'Hello, playground!',
    };
  }
}

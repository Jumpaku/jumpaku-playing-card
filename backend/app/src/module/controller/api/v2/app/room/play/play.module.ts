import { Module } from '@nestjs/common';
import { PlayServiceController } from '../../../../../../../gen/pb/api/v2/app/room/play/service/PlayService_rb.controller';
import { PlayServiceService } from '../../../../../../../gen/pb/api/v2/app/room/play/service/PlayService_rb.service';
import { PlayService } from './play.service';

@Module({
  controllers: [PlayServiceController],
  providers: [
    {
      provide: PlayServiceService,
      useClass: PlayService,
    },
  ],
  imports: [],
})
export class PlayModule {}

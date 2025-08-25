import { Module } from '@nestjs/common';
import { RoomServiceController } from '../../../../../../gen/pb/api/v2/app/room/service/RoomService_rb.controller';
import { RoomServiceService } from '../../../../../../gen/pb/api/v2/app/room/service/RoomService_rb.service';
import { RoomService } from './room.service';

@Module({
  controllers: [RoomServiceController],
  providers: [
    {
      provide: RoomServiceService,
      useClass: RoomService,
    },
  ],
  imports: [],
})
export class RoomModule {}

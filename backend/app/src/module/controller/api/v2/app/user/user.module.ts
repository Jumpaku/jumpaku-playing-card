import { Module } from '@nestjs/common';
import { UserServiceController } from '../../../../../../gen/pb/api/v2/app/user/service/UserService_rb.controller';
import { UserServiceService } from '../../../../../../gen/pb/api/v2/app/user/service/UserService_rb.service';
import { UserService } from './user.service';

@Module({
  controllers: [UserServiceController],
  providers: [
    {
      provide: UserServiceService,
      useClass: UserService,
    },
  ],
  imports: [],
})
export class UserModule {}

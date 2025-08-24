import {Module} from '@nestjs/common';
import {RoomService} from "./room.service";
import {RoomRepository} from "./room.repository";
import {RoomServiceController} from "../../../../../../gen/pb/api/v1/app/room/service/RoomService_rb.controller";
import {RoomServiceService} from "../../../../../../gen/pb/api/v1/app/room/service/RoomService_rb.service";
import {UserModule} from "../../../../../shared/user/user.module";

@Module({
    controllers: [RoomServiceController],
    providers: [
        {
            provide: RoomServiceService,
            useClass: RoomService,
        },
        RoomRepository,
    ],
    imports: [
        UserModule,
    ],
})
export class RoomModule {
}

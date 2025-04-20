import {Module} from '@nestjs/common';
import {PlayServiceService} from "../../../../../../../gen/pb/api/v1/app/room/play/service/PlayService_rb.service";
import {
    PlayServiceController
} from "../../../../../../../gen/pb/api/v1/app/room/play/service/PlayService_rb.controller";
import {SessionModule} from "../../../../../../shared/session/session.module";
import {UserModule} from "../../../../../../shared/user/user.module";
import {PlayService} from "./play.service";

@Module({
    controllers: [PlayServiceController],
    providers: [
        {
            provide: PlayServiceService,
            useClass: PlayService,
        },
    ],
    imports: [
        SessionModule,
        UserModule,
    ],
})
export class PlayModule {
}

import {Module} from '@nestjs/common';
import {PlayServiceService} from "../../../../../../../gen/pb/api/v1/app/room/play/service/PlayService_rb.service";
import {
    PlayServiceController
} from "../../../../../../../gen/pb/api/v1/app/room/play/service/PlayService_rb.controller";
import {UserModule} from "../../../../../../shared/user/user.module";
import {PlayService} from "./play.service";
import {CardRepository} from "./card.repository";
import {MasterCardRepository} from "./master_card.repository";
import {PlaceRepository} from "./place.repository";
import {MemberRepository} from "./member.repository";
import {SeatRepository} from "./seat.repository";

@Module({
    controllers: [PlayServiceController],
    providers: [
        {
            provide: PlayServiceService,
            useClass: PlayService,
        },
        CardRepository,
        MasterCardRepository,
        PlaceRepository,
        MemberRepository,
        SeatRepository,
    ],
    imports: [
        UserModule,
    ],
})
export class PlayModule {
}

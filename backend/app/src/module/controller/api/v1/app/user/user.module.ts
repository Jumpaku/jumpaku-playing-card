import {Module} from '@nestjs/common';
import {UserServiceController} from "../../../../../../gen/pb/api/v1/app/user/service/UserService_rb.controller";
import {UserServiceService} from "../../../../../../gen/pb/api/v1/app/user/service/UserService_rb.service";
import {UserService} from "./user.service";
import {UserRepository} from "./user.repository";
import {SessionModule} from "../../../../../shared/session/session.module";

@Module({
    controllers: [UserServiceController],
    providers: [
        {
            provide: UserServiceService,
            useClass: UserService,
        },
        UserRepository,
    ],
    imports: [
        SessionModule,
    ],
})
export class UserModule {
}

import {Module} from '@nestjs/common';
import {UserServiceController} from "../../../../../../gen/pb/api/v1/app/user/service/UserService_rb.controller";
import {UserServiceService} from "../../../../../../gen/pb/api/v1/app/user/service/UserService_rb.service";
import {UserService} from "./user.service";
import {UserRepository} from "./user.repository";
import {UserModule as SharedUserModule} from "../../../../../shared/user/user.module";
import {UserAuthenticationRepository} from "./user_authentication.repository";

@Module({
    controllers: [UserServiceController],
    providers: [
        {
            provide: UserServiceService,
            useClass: UserService,
        },
        UserRepository,
        UserAuthenticationRepository,
    ],
    imports: [
        SharedUserModule,
    ],
})
export class UserModule {
}

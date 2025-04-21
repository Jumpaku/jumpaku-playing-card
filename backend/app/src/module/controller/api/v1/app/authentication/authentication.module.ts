import {Module} from '@nestjs/common';
import {
    AuthenticationServiceController
} from "../../../../../../gen/pb/api/v1/app/authentication/service/AuthenticationService_rb.controller";
import {
    AuthenticationServiceService
} from "../../../../../../gen/pb/api/v1/app/authentication/service/AuthenticationService_rb.service";
import {AuthenticationService} from "./authentication.service";
import {AuthenticationPasswordProvider} from "./authentication_password.provider";
import {AuthenticationTemporaryProvider} from "./authentication_temporary.provider";
import {SessionRepository} from "./session.repository";
import {JwtProvider} from "./jwt.provider";
import {AuthenticationPasswordRepository} from "./authentication_password.repository";
import {AuthenticationTemporaryRepository} from "./authentication_temporary.repository";
import {UserModule} from "../../../../../shared/user/user.module";

@Module({
    controllers: [AuthenticationServiceController],
    providers: [
        {
            provide: AuthenticationServiceService,
            useClass: AuthenticationService,
        },
        AuthenticationPasswordProvider,
        AuthenticationPasswordRepository,
        AuthenticationTemporaryProvider,
        AuthenticationTemporaryRepository,
        SessionRepository,
        JwtProvider,
    ],
    imports: [
        UserModule,
    ]
})
export class AuthenticationModule {
}

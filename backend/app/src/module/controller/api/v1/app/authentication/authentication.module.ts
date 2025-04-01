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
import {SessionModule} from "../../../../../shared/session/session.module";

@Module({
    controllers: [AuthenticationServiceController],
    providers: [
        {
            provide: AuthenticationServiceService,
            useClass: AuthenticationService,
        },
        AuthenticationPasswordProvider,
        AuthenticationTemporaryProvider,
        SessionRepository,
        JwtProvider,
    ],
    imports: [
        SessionModule,
    ],
})
export class AuthenticationModule {
}

import {Module} from '@nestjs/common';
import {
    AuthenticationServiceController
} from "../../../../../../gen/pb/api/v1/app/authentication/service/AuthenticationService_rb.controller";
import {
    AuthenticationServiceService
} from "../../../../../../gen/pb/api/v1/app/authentication/service/AuthenticationService_rb.service";
import {AuthenticationService} from "./authentication.service";
import {AuthenticationPasswordProvider} from "./password.provider";
import {AuthenticationTemporaryProvider} from "./temporary.provider";

@Module({
    controllers: [AuthenticationServiceController],
    providers: [
        {
            provide: AuthenticationServiceService,
            useClass: AuthenticationService,
        },
        AuthenticationPasswordProvider,
        AuthenticationTemporaryProvider,
    ],
})
export class AuthenticationModule {
}

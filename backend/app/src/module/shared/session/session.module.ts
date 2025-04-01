import {Module} from "@nestjs/common";
import {SessionProvider} from "./session.provider";

@Module(
    {
        providers: [
            SessionProvider,
        ],
        exports: [
            SessionProvider,
        ],
    }
)
export class SessionModule {
}
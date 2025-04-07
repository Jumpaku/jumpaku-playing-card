import {Module} from "@nestjs/common";
import {UserProvider} from "./user.provider";

@Module({
    imports: [],
    providers: [UserProvider],
    exports: [UserProvider],
})
export class UserModule {
}
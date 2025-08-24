import {Injectable} from "@nestjs/common";
import {User$} from "../../../../../../gen/pg/dao/dao_User";
import {PgClient} from "../../../../../global/postgres.provider";
import {UserAuthentication$} from "../../../../../../gen/pg/dao/dao_UserAuthentication";

@Injectable()
export class UserRepository {
    async create(tx: PgClient, userId: string, displayName: string, userAuthenticationId: string, authenticationId: string, t: Date): Promise<void> {
        await User$.insert(tx, {
            user_id: userId,
            display_name: displayName,
            create_time: t,
            update_time: t,
        });
        await UserAuthentication$.insert(tx, {
            user_authentication_id: userAuthenticationId,
            user_id: userId,
            authentication_id: authenticationId,
            create_time: t,
            update_time: t,
        });
    }
}
import {Injectable} from "@nestjs/common";
import {User$} from "../../../../../../gen/pg/dao/dao_User";
import {PgClient} from "../../../../../global/postgres.provider";

@Injectable()
export class RoomRepository {
    async create(tx: PgClient, userId: string, displayName: string, t: Date): Promise<void> {
        await User$.insert(tx, {
            user_id: userId,
            display_name: displayName,
            create_time: t,
            update_time: t,
        });
    }
}
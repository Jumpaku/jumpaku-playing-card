import {Injectable} from "@nestjs/common";
import {PgClient, selectAll} from "../../../../../../global/postgres.provider";
import {MasterCard$} from "../../../../../../../gen/pg/dao/dao_MasterCard";

@Injectable()
export class MasterCardRepository {
    async deck(tx: PgClient): Promise<MasterCard$[]> {
        return await selectAll<MasterCard$>(tx,
            `SELECT *
             FROM "MasterCard"`,
            [],
        );
    }
}
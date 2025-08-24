export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type RoomPlayHistoryProp$ = {

    room_play_history_id: string;

    room_id: string;

    entry_order: bigint;

    operator_member_id: string;

    operator_seat_id: string;

    operation: string;

    room_place_id: string;

    source_card_index?: bigint | null;

    destination_place_id?: string | null;

    destination_card_side?: string | null;

    create_time: Date;

    update_time: Date;

};

export type RoomPlayHistoryPk$ = {

    room_play_history_id: string;

};






export class RoomPlayHistory$ {
    constructor(props: RoomPlayHistoryProp$) {

        this.room_play_history_id = props.room_play_history_id;

        this.room_id = props.room_id;

        this.entry_order = props.entry_order;

        this.operator_member_id = props.operator_member_id;

        this.operator_seat_id = props.operator_seat_id;

        this.operation = props.operation;

        this.room_place_id = props.room_place_id;

        this.source_card_index = props.source_card_index ?? null;

        this.destination_place_id = props.destination_place_id ?? null;

        this.destination_card_side = props.destination_card_side ?? null;

        this.create_time = props.create_time;

        this.update_time = props.update_time;

    }


    room_play_history_id: string;

    room_id: string;

    entry_order: bigint;

    operator_member_id: string;

    operator_seat_id: string;

    operation: string;

    room_place_id: string;

    source_card_index: bigint | null;

    destination_place_id: string | null;

    destination_card_side: string | null;

    create_time: Date;

    update_time: Date;


    static async insert(client: PgClient, ...models: RoomPlayHistory$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.room_play_history_id,

            model.room_id,

            model.entry_order,

            model.operator_member_id,

            model.operator_seat_id,

            model.operation,

            model.room_place_id,

            model.source_card_index,

            model.destination_place_id,

            model.destination_card_side,

            model.create_time,

            model.update_time,

        ]);
        const cols = values.length / models.length;
        let params = "";
        for (let i = 0; i < models.length; i++) {
            if (i > 0) {
                params += ", ";
            }
            params += "(";
            for (let j = 0; j < cols; j++) {
                if (j > 0) {
                    params += ", ";
                }
                params += `$${i * cols + j + 1}`;
            }
            params += ")";
        }
        await client.query(`INSERT INTO "RoomPlayHistory" (

    "room_play_history_id"
,
    "room_id"
,
    "entry_order"
,
    "operator_member_id"
,
    "operator_seat_id"
,
    "operation"
,
    "room_place_id"
,
    "source_card_index"
,
    "destination_place_id"
,
    "destination_card_side"
,
    "create_time"
,
    "update_time"

) VALUES ${params}`,
            values,
        );
    }

    static async update(client: PgClient, model: RoomPlayHistory$): Promise<void> {
        const values = [

            model.room_id,

            model.entry_order,

            model.operator_member_id,

            model.operator_seat_id,

            model.operation,

            model.room_place_id,

            model.source_card_index,

            model.destination_place_id,

            model.destination_card_side,

            model.create_time,

            model.update_time,


            model.room_play_history_id,

        ];
        await client.query(
            `UPDATE "RoomPlayHistory" SET

    "room_id" = $${ 0 + 1 }
,
    "entry_order" = $${ 1 + 1 }
,
    "operator_member_id" = $${ 2 + 1 }
,
    "operator_seat_id" = $${ 3 + 1 }
,
    "operation" = $${ 4 + 1 }
,
    "room_place_id" = $${ 5 + 1 }
,
    "source_card_index" = $${ 6 + 1 }
,
    "destination_place_id" = $${ 7 + 1 }
,
    "destination_card_side" = $${ 8 + 1 }
,
    "create_time" = $${ 9 + 1 }
,
    "update_time" = $${ 10 + 1 }

WHERE
     "room_play_history_id" = $${ 0 + 11 + 1 }
`,
            values);
    }

    static async upsert(client: PgClient, model: RoomPlayHistory$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: RoomPlayHistoryPk$): Promise<void> {
        const values = [

            pk.room_play_history_id,

        ];
        await client.query(
            `DELETE FROM "RoomPlayHistory"
WHERE

     "room_play_history_id" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: RoomPlayHistoryPk$): Promise<RoomPlayHistory$ | null> {
        const values = [

            pk.room_play_history_id,

        ];
        const res = await client.query(
            `SELECT *
FROM "RoomPlayHistory"
WHERE

     "room_play_history_id" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new RoomPlayHistory$(res.rows[0] as RoomPlayHistoryProp$);
    }




}
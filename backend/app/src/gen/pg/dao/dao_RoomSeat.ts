export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type RoomSeatProp$ = {

    room_seat_id: string;

    room_id: string;

    room_seat_name: string;

    create_time: Date;

    update_time: Date;

};

export type RoomSeatPk$ = {

    room_seat_id: string;

};






export class RoomSeat$ {
    constructor(props: RoomSeatProp$) {

        this.room_seat_id = props.room_seat_id;

        this.room_id = props.room_id;

        this.room_seat_name = props.room_seat_name;

        this.create_time = props.create_time;

        this.update_time = props.update_time;

    }


    room_seat_id: string;

    room_id: string;

    room_seat_name: string;

    create_time: Date;

    update_time: Date;


    static async insert(client: PgClient, ...models: RoomSeat$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.room_seat_id,

            model.room_id,

            model.room_seat_name,

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
        await client.query(`INSERT INTO "RoomSeat" (

    "room_seat_id"
,
    "room_id"
,
    "room_seat_name"
,
    "create_time"
,
    "update_time"

) VALUES ${params}`,
            values,
        );
    }

    static async update(client: PgClient, model: RoomSeat$): Promise<void> {
        const values = [

            model.room_id,

            model.room_seat_name,

            model.create_time,

            model.update_time,


            model.room_seat_id,

        ];
        await client.query(
            `UPDATE "RoomSeat" SET

    "room_id" = $${ 0 + 1 }
,
    "room_seat_name" = $${ 1 + 1 }
,
    "create_time" = $${ 2 + 1 }
,
    "update_time" = $${ 3 + 1 }

WHERE
     "room_seat_id" = $${ 0 + 4 + 1 }
`,
            values);
    }

    static async upsert(client: PgClient, model: RoomSeat$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: RoomSeatPk$): Promise<void> {
        const values = [

            pk.room_seat_id,

        ];
        await client.query(
            `DELETE FROM "RoomSeat"
WHERE

     "room_seat_id" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: RoomSeatPk$): Promise<RoomSeat$ | null> {
        const values = [

            pk.room_seat_id,

        ];
        const res = await client.query(
            `SELECT *
FROM "RoomSeat"
WHERE

     "room_seat_id" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new RoomSeat$(res.rows[0] as RoomSeatProp$);
    }




}
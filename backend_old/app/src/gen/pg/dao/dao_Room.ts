export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type RoomProp$ = {

    room_id: string;

    room_name: string;

    create_time: Date;

    update_time: Date;

};

export type RoomPk$ = {

    room_id: string;

};






export class Room$ {
    constructor(props: RoomProp$) {

        this.room_id = props.room_id;

        this.room_name = props.room_name;

        this.create_time = props.create_time;

        this.update_time = props.update_time;

    }


    room_id: string;

    room_name: string;

    create_time: Date;

    update_time: Date;


    static async insert(client: PgClient, ...models: Room$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.room_id,

            model.room_name,

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
        await client.query(`INSERT INTO "Room" (

    "room_id"
,
    "room_name"
,
    "create_time"
,
    "update_time"

) VALUES ${params}`,
            values,
        );
    }

    static async update(client: PgClient, model: Room$): Promise<void> {
        const values = [

            model.room_name,

            model.create_time,

            model.update_time,


            model.room_id,

        ];
        await client.query(
            `UPDATE "Room" SET

    "room_name" = $${ 0 + 1 }
,
    "create_time" = $${ 1 + 1 }
,
    "update_time" = $${ 2 + 1 }

WHERE
     "room_id" = $${ 0 + 3 + 1 }
`,
            values);
    }

    static async upsert(client: PgClient, model: Room$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: RoomPk$): Promise<void> {
        const values = [

            pk.room_id,

        ];
        await client.query(
            `DELETE FROM "Room"
WHERE

     "room_id" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: RoomPk$): Promise<Room$ | null> {
        const values = [

            pk.room_id,

        ];
        const res = await client.query(
            `SELECT *
FROM "Room"
WHERE

     "room_id" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new Room$(res.rows[0] as RoomProp$);
    }




}
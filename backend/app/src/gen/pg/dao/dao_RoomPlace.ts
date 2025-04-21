export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type RoomPlaceProp$ = {

    room_place_id: string;

    room_id: string;

    display_name: string;

    type: string;

    owner_seat_id?: string | null;

    create_time: Date;

    update_time: Date;

};

export type RoomPlacePk$ = {

    room_place_id: string;

};





export type RoomPlace_ListIdx_RoomPlace_RoomIdAndPlaceIdKey$ = {
    
    room_id?: string;
    
    room_place_id?: string;
    
};


export class RoomPlace$ {
    constructor(props: RoomPlaceProp$) {

        this.room_place_id = props.room_place_id;

        this.room_id = props.room_id;

        this.display_name = props.display_name;

        this.type = props.type;

        this.owner_seat_id = props.owner_seat_id ?? null;

        this.create_time = props.create_time;

        this.update_time = props.update_time;

    }


    room_place_id: string;

    room_id: string;

    display_name: string;

    type: string;

    owner_seat_id: string | null;

    create_time: Date;

    update_time: Date;


    static async insert(client: PgClient, ...models: RoomPlace$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.room_place_id,

            model.room_id,

            model.display_name,

            model.type,

            model.owner_seat_id,

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
        await client.query(`INSERT INTO "RoomPlace" (

    "room_place_id"
,
    "room_id"
,
    "display_name"
,
    "type"
,
    "owner_seat_id"
,
    "create_time"
,
    "update_time"

) VALUES ${params}`,
            values,
        );
    }

    static async update(client: PgClient, model: RoomPlace$): Promise<void> {
        const values = [

            model.room_id,

            model.display_name,

            model.type,

            model.owner_seat_id,

            model.create_time,

            model.update_time,


            model.room_place_id,

        ];
        await client.query(
            `UPDATE "RoomPlace" SET

    "room_id" = $${ 0 + 1 }
,
    "display_name" = $${ 1 + 1 }
,
    "type" = $${ 2 + 1 }
,
    "owner_seat_id" = $${ 3 + 1 }
,
    "create_time" = $${ 4 + 1 }
,
    "update_time" = $${ 5 + 1 }

WHERE
     "room_place_id" = $${ 0 + 6 + 1 }
`,
            values);
    }

    static async upsert(client: PgClient, model: RoomPlace$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: RoomPlacePk$): Promise<void> {
        const values = [

            pk.room_place_id,

        ];
        await client.query(
            `DELETE FROM "RoomPlace"
WHERE

     "room_place_id" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: RoomPlacePk$): Promise<RoomPlace$ | null> {
        const values = [

            pk.room_place_id,

        ];
        const res = await client.query(
            `SELECT *
FROM "RoomPlace"
WHERE

     "room_place_id" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new RoomPlace$(res.rows[0] as RoomPlaceProp$);
    }




    static async listByIdx_RoomPlace_RoomIdAndPlaceId(client: PgClient, key: RoomPlace_ListIdx_RoomPlace_RoomIdAndPlaceIdKey$): Promise<RoomPlace$[]> {
        const params: unknown[] = [];
        let stmt: string = `SELECT *
FROM "RoomPlace"
WHERE `;
    
        if (key.room_id !== undefined) {
            params.push(key.room_id);
            if (params.length > 1) {
                stmt += " AND ";
            }
            stmt += `"room_id" = $${params.length}`;
        }
    
        if (key.room_place_id !== undefined) {
            params.push(key.room_place_id);
            if (params.length > 1) {
                stmt += " AND ";
            }
            stmt += `"room_place_id" = $${params.length}`;
        }
    
        if (params.length === 0) {
            throw new Error("No key provided");
        }
        const res = await client.query(stmt, params);
        return res.rows.map((row: any) => new RoomPlace$(row));
    }

}
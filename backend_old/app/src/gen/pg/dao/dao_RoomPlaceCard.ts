export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type RoomPlaceCardProp$ = {

    room_place_card_id: string;

    room_place_id: string;

    room_id: string;

    side: string;

    master_card_id: string;

    create_time: Date;

    update_time: Date;

};

export type RoomPlaceCardPk$ = {

    room_place_card_id: string;

};





export type RoomPlaceCard_ListIdx_RoomPlaceCard_RoomIdAndPlaceIdAndCardIdKey$ = {
    
    room_id?: string;
    
    room_place_id?: string;
    
    room_place_card_id?: string;
    
};


export class RoomPlaceCard$ {
    constructor(props: RoomPlaceCardProp$) {

        this.room_place_card_id = props.room_place_card_id;

        this.room_place_id = props.room_place_id;

        this.room_id = props.room_id;

        this.side = props.side;

        this.master_card_id = props.master_card_id;

        this.create_time = props.create_time;

        this.update_time = props.update_time;

    }


    room_place_card_id: string;

    room_place_id: string;

    room_id: string;

    side: string;

    master_card_id: string;

    create_time: Date;

    update_time: Date;


    static async insert(client: PgClient, ...models: RoomPlaceCard$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.room_place_card_id,

            model.room_place_id,

            model.room_id,

            model.side,

            model.master_card_id,

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
        await client.query(`INSERT INTO "RoomPlaceCard" (

    "room_place_card_id"
,
    "room_place_id"
,
    "room_id"
,
    "side"
,
    "master_card_id"
,
    "create_time"
,
    "update_time"

) VALUES ${params}`,
            values,
        );
    }

    static async update(client: PgClient, model: RoomPlaceCard$): Promise<void> {
        const values = [

            model.room_place_id,

            model.room_id,

            model.side,

            model.master_card_id,

            model.create_time,

            model.update_time,


            model.room_place_card_id,

        ];
        await client.query(
            `UPDATE "RoomPlaceCard" SET

    "room_place_id" = $${ 0 + 1 }
,
    "room_id" = $${ 1 + 1 }
,
    "side" = $${ 2 + 1 }
,
    "master_card_id" = $${ 3 + 1 }
,
    "create_time" = $${ 4 + 1 }
,
    "update_time" = $${ 5 + 1 }

WHERE
     "room_place_card_id" = $${ 0 + 6 + 1 }
`,
            values);
    }

    static async upsert(client: PgClient, model: RoomPlaceCard$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: RoomPlaceCardPk$): Promise<void> {
        const values = [

            pk.room_place_card_id,

        ];
        await client.query(
            `DELETE FROM "RoomPlaceCard"
WHERE

     "room_place_card_id" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: RoomPlaceCardPk$): Promise<RoomPlaceCard$ | null> {
        const values = [

            pk.room_place_card_id,

        ];
        const res = await client.query(
            `SELECT *
FROM "RoomPlaceCard"
WHERE

     "room_place_card_id" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new RoomPlaceCard$(res.rows[0] as RoomPlaceCardProp$);
    }




    static async listByIdx_RoomPlaceCard_RoomIdAndPlaceIdAndCardId(client: PgClient, key: RoomPlaceCard_ListIdx_RoomPlaceCard_RoomIdAndPlaceIdAndCardIdKey$): Promise<RoomPlaceCard$[]> {
        const params: unknown[] = [];
        let stmt: string = `SELECT *
FROM "RoomPlaceCard"
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
    
        if (key.room_place_card_id !== undefined) {
            params.push(key.room_place_card_id);
            if (params.length > 1) {
                stmt += " AND ";
            }
            stmt += `"room_place_card_id" = $${params.length}`;
        }
    
        if (params.length === 0) {
            throw new Error("No key provided");
        }
        const res = await client.query(stmt, params);
        return res.rows.map((row: any) => new RoomPlaceCard$(row));
    }

}
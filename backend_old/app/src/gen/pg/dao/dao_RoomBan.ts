export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type RoomBanProp$ = {

    room_ban_id: string;

    room_id: string;

    ban_user_id: string;

    create_time: Date;

    update_time: Date;

};

export type RoomBanPk$ = {

    room_ban_id: string;

};



export type RoomBan_FindUq_RoomBan_RoomUserKey$ = {
    
    room_id: string;
    
    ban_user_id: string;
    
};



export type RoomBan_ListUq_RoomBan_RoomUserKey$ = {
    
    room_id?: string;
    
    ban_user_id?: string;
    
};


export class RoomBan$ {
    constructor(props: RoomBanProp$) {

        this.room_ban_id = props.room_ban_id;

        this.room_id = props.room_id;

        this.ban_user_id = props.ban_user_id;

        this.create_time = props.create_time;

        this.update_time = props.update_time;

    }


    room_ban_id: string;

    room_id: string;

    ban_user_id: string;

    create_time: Date;

    update_time: Date;


    static async insert(client: PgClient, ...models: RoomBan$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.room_ban_id,

            model.room_id,

            model.ban_user_id,

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
        await client.query(`INSERT INTO "RoomBan" (

    "room_ban_id"
,
    "room_id"
,
    "ban_user_id"
,
    "create_time"
,
    "update_time"

) VALUES ${params}`,
            values,
        );
    }

    static async update(client: PgClient, model: RoomBan$): Promise<void> {
        const values = [

            model.room_id,

            model.ban_user_id,

            model.create_time,

            model.update_time,


            model.room_ban_id,

        ];
        await client.query(
            `UPDATE "RoomBan" SET

    "room_id" = $${ 0 + 1 }
,
    "ban_user_id" = $${ 1 + 1 }
,
    "create_time" = $${ 2 + 1 }
,
    "update_time" = $${ 3 + 1 }

WHERE
     "room_ban_id" = $${ 0 + 4 + 1 }
`,
            values);
    }

    static async upsert(client: PgClient, model: RoomBan$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: RoomBanPk$): Promise<void> {
        const values = [

            pk.room_ban_id,

        ];
        await client.query(
            `DELETE FROM "RoomBan"
WHERE

     "room_ban_id" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: RoomBanPk$): Promise<RoomBan$ | null> {
        const values = [

            pk.room_ban_id,

        ];
        const res = await client.query(
            `SELECT *
FROM "RoomBan"
WHERE

     "room_ban_id" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new RoomBan$(res.rows[0] as RoomBanProp$);
    }


    static async findByUq_RoomBan_RoomUser(client: PgClient, key: RoomBan_FindUq_RoomBan_RoomUserKey$): Promise<RoomBan$ | null> {
        const params: unknown[] = [];
        let stmt: string = `SELECT *
FROM "RoomBan"
WHERE `;
    
        params.push(key.room_id);
        if (params.length > 1) {
            stmt += " AND ";
        }
        stmt += `"room_id" = $${params.length}`;
    
        params.push(key.ban_user_id);
        if (params.length > 1) {
            stmt += " AND ";
        }
        stmt += `"ban_user_id" = $${params.length}`;
    
        stmt += " LIMIT 1";
        const res = await client.query(stmt, params);
        if (res.rows.length === 0) {
            return null;
        }
        return new RoomBan$(res.rows[0] as any);
    }



    static async listByUq_RoomBan_RoomUser(client: PgClient, key: RoomBan_ListUq_RoomBan_RoomUserKey$): Promise<RoomBan$[]> {
        const params: unknown[] = [];
        let stmt: string = `SELECT *
FROM "RoomBan"
WHERE `;
    
        if (key.room_id !== undefined) {
            params.push(key.room_id);
            if (params.length > 1) {
                stmt += " AND ";
            }
            stmt += `"room_id" = $${params.length}`;
        }
    
        if (key.ban_user_id !== undefined) {
            params.push(key.ban_user_id);
            if (params.length > 1) {
                stmt += " AND ";
            }
            stmt += `"ban_user_id" = $${params.length}`;
        }
    
        if (params.length === 0) {
            throw new Error("No key provided");
        }
        const res = await client.query(stmt, params);
        return res.rows.map((row: any) => new RoomBan$(row));
    }

}
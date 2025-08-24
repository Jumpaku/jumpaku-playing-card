export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type RoomMemberProp$ = {

    room_member_id: string;

    room_id: string;

    user_id: string;

    role_id: string;

    create_time: Date;

    update_time: Date;

};

export type RoomMemberPk$ = {

    room_member_id: string;

};



export type RoomMember_FindUq_RoomMember_RoomUserKey$ = {
    
    room_id: string;
    
    user_id: string;
    
};



export type RoomMember_ListIdx_RoomMember_RoomIdAndMemberIdKey$ = {
    
    room_id?: string;
    
    room_member_id?: string;
    
};

export type RoomMember_ListUq_RoomMember_RoomUserKey$ = {
    
    room_id?: string;
    
    user_id?: string;
    
};


export class RoomMember$ {
    constructor(props: RoomMemberProp$) {

        this.room_member_id = props.room_member_id;

        this.room_id = props.room_id;

        this.user_id = props.user_id;

        this.role_id = props.role_id;

        this.create_time = props.create_time;

        this.update_time = props.update_time;

    }


    room_member_id: string;

    room_id: string;

    user_id: string;

    role_id: string;

    create_time: Date;

    update_time: Date;


    static async insert(client: PgClient, ...models: RoomMember$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.room_member_id,

            model.room_id,

            model.user_id,

            model.role_id,

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
        await client.query(`INSERT INTO "RoomMember" (

    "room_member_id"
,
    "room_id"
,
    "user_id"
,
    "role_id"
,
    "create_time"
,
    "update_time"

) VALUES ${params}`,
            values,
        );
    }

    static async update(client: PgClient, model: RoomMember$): Promise<void> {
        const values = [

            model.room_id,

            model.user_id,

            model.role_id,

            model.create_time,

            model.update_time,


            model.room_member_id,

        ];
        await client.query(
            `UPDATE "RoomMember" SET

    "room_id" = $${ 0 + 1 }
,
    "user_id" = $${ 1 + 1 }
,
    "role_id" = $${ 2 + 1 }
,
    "create_time" = $${ 3 + 1 }
,
    "update_time" = $${ 4 + 1 }

WHERE
     "room_member_id" = $${ 0 + 5 + 1 }
`,
            values);
    }

    static async upsert(client: PgClient, model: RoomMember$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: RoomMemberPk$): Promise<void> {
        const values = [

            pk.room_member_id,

        ];
        await client.query(
            `DELETE FROM "RoomMember"
WHERE

     "room_member_id" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: RoomMemberPk$): Promise<RoomMember$ | null> {
        const values = [

            pk.room_member_id,

        ];
        const res = await client.query(
            `SELECT *
FROM "RoomMember"
WHERE

     "room_member_id" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new RoomMember$(res.rows[0] as RoomMemberProp$);
    }


    static async findByUq_RoomMember_RoomUser(client: PgClient, key: RoomMember_FindUq_RoomMember_RoomUserKey$): Promise<RoomMember$ | null> {
        const params: unknown[] = [];
        let stmt: string = `SELECT *
FROM "RoomMember"
WHERE `;
    
        params.push(key.room_id);
        if (params.length > 1) {
            stmt += " AND ";
        }
        stmt += `"room_id" = $${params.length}`;
    
        params.push(key.user_id);
        if (params.length > 1) {
            stmt += " AND ";
        }
        stmt += `"user_id" = $${params.length}`;
    
        stmt += " LIMIT 1";
        const res = await client.query(stmt, params);
        if (res.rows.length === 0) {
            return null;
        }
        return new RoomMember$(res.rows[0] as any);
    }



    static async listByIdx_RoomMember_RoomIdAndMemberId(client: PgClient, key: RoomMember_ListIdx_RoomMember_RoomIdAndMemberIdKey$): Promise<RoomMember$[]> {
        const params: unknown[] = [];
        let stmt: string = `SELECT *
FROM "RoomMember"
WHERE `;
    
        if (key.room_id !== undefined) {
            params.push(key.room_id);
            if (params.length > 1) {
                stmt += " AND ";
            }
            stmt += `"room_id" = $${params.length}`;
        }
    
        if (key.room_member_id !== undefined) {
            params.push(key.room_member_id);
            if (params.length > 1) {
                stmt += " AND ";
            }
            stmt += `"room_member_id" = $${params.length}`;
        }
    
        if (params.length === 0) {
            throw new Error("No key provided");
        }
        const res = await client.query(stmt, params);
        return res.rows.map((row: any) => new RoomMember$(row));
    }

    static async listByUq_RoomMember_RoomUser(client: PgClient, key: RoomMember_ListUq_RoomMember_RoomUserKey$): Promise<RoomMember$[]> {
        const params: unknown[] = [];
        let stmt: string = `SELECT *
FROM "RoomMember"
WHERE `;
    
        if (key.room_id !== undefined) {
            params.push(key.room_id);
            if (params.length > 1) {
                stmt += " AND ";
            }
            stmt += `"room_id" = $${params.length}`;
        }
    
        if (key.user_id !== undefined) {
            params.push(key.user_id);
            if (params.length > 1) {
                stmt += " AND ";
            }
            stmt += `"user_id" = $${params.length}`;
        }
    
        if (params.length === 0) {
            throw new Error("No key provided");
        }
        const res = await client.query(stmt, params);
        return res.rows.map((row: any) => new RoomMember$(row));
    }

}
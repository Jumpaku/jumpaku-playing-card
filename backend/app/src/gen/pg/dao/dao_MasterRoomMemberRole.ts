export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type MasterRoomMemberRoleProp$ = {

    room_member_role_id: string;

    role_name: string;

};

export type MasterRoomMemberRolePk$ = {

    room_member_role_id: string;

};






export class MasterRoomMemberRole$ {
    constructor(props: MasterRoomMemberRoleProp$) {

        this.room_member_role_id = props.room_member_role_id;

        this.role_name = props.role_name;

    }


    room_member_role_id: string;

    role_name: string;


    static async insert(client: PgClient, ...models: MasterRoomMemberRole$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.room_member_role_id,

            model.role_name,

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
        await client.query(`INSERT INTO "MasterRoomMemberRole" (

    "room_member_role_id"
,
    "role_name"

) VALUES ${params}`,
            values,
        );
    }

    static async update(client: PgClient, model: MasterRoomMemberRole$): Promise<void> {
        const values = [

            model.role_name,


            model.room_member_role_id,

        ];
        await client.query(
            `UPDATE "MasterRoomMemberRole" SET

    "role_name" = $${ 0 + 1 }

WHERE
     "room_member_role_id" = $${ 0 + 1 + 1 }
`,
            values);
    }

    static async upsert(client: PgClient, model: MasterRoomMemberRole$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: MasterRoomMemberRolePk$): Promise<void> {
        const values = [

            pk.room_member_role_id,

        ];
        await client.query(
            `DELETE FROM "MasterRoomMemberRole"
WHERE

     "room_member_role_id" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: MasterRoomMemberRolePk$): Promise<MasterRoomMemberRole$ | null> {
        const values = [

            pk.room_member_role_id,

        ];
        const res = await client.query(
            `SELECT *
FROM "MasterRoomMemberRole"
WHERE

     "room_member_role_id" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new MasterRoomMemberRole$(res.rows[0] as MasterRoomMemberRoleProp$);
    }




}
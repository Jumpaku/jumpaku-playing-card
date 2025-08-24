export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type RolePermissionProp$ = {

    role_permission_id: string;

    role_id: string;

    permission_id: string;

    create_time: Date;

    update_time: Date;

};

export type RolePermissionPk$ = {

    role_permission_id: string;

};






export class RolePermission$ {
    constructor(props: RolePermissionProp$) {

        this.role_permission_id = props.role_permission_id;

        this.role_id = props.role_id;

        this.permission_id = props.permission_id;

        this.create_time = props.create_time;

        this.update_time = props.update_time;

    }


    role_permission_id: string;

    role_id: string;

    permission_id: string;

    create_time: Date;

    update_time: Date;


    static async insert(client: PgClient, ...models: RolePermission$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.role_permission_id,

            model.role_id,

            model.permission_id,

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
        await client.query(`INSERT INTO "RolePermission" (

    "role_permission_id"
,
    "role_id"
,
    "permission_id"
,
    "create_time"
,
    "update_time"

) VALUES ${params}`,
            values,
        );
    }

    static async update(client: PgClient, model: RolePermission$): Promise<void> {
        const values = [

            model.role_id,

            model.permission_id,

            model.create_time,

            model.update_time,


            model.role_permission_id,

        ];
        await client.query(
            `UPDATE "RolePermission" SET

    "role_id" = $${ 0 + 1 }
,
    "permission_id" = $${ 1 + 1 }
,
    "create_time" = $${ 2 + 1 }
,
    "update_time" = $${ 3 + 1 }

WHERE
     "role_permission_id" = $${ 0 + 4 + 1 }
`,
            values);
    }

    static async upsert(client: PgClient, model: RolePermission$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: RolePermissionPk$): Promise<void> {
        const values = [

            pk.role_permission_id,

        ];
        await client.query(
            `DELETE FROM "RolePermission"
WHERE

     "role_permission_id" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: RolePermissionPk$): Promise<RolePermission$ | null> {
        const values = [

            pk.role_permission_id,

        ];
        const res = await client.query(
            `SELECT *
FROM "RolePermission"
WHERE

     "role_permission_id" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new RolePermission$(res.rows[0] as RolePermissionProp$);
    }




}
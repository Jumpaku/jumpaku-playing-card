export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type MasterRolePermissionProp$ = {

    role_permission_id: string;

    role_id: string;

    permission_id: string;

};

export type MasterRolePermissionPk$ = {

    role_permission_id: string;

};






export class MasterRolePermission$ {
    constructor(props: MasterRolePermissionProp$) {

        this.role_permission_id = props.role_permission_id;

        this.role_id = props.role_id;

        this.permission_id = props.permission_id;

    }


    role_permission_id: string;

    role_id: string;

    permission_id: string;


    static async insert(client: PgClient, ...models: MasterRolePermission$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.role_permission_id,

            model.role_id,

            model.permission_id,

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
        await client.query(`INSERT INTO "MasterRolePermission" (

    "role_permission_id"
,
    "role_id"
,
    "permission_id"

) VALUES ${params}`,
            values,
        );
    }

    static async update(client: PgClient, model: MasterRolePermission$): Promise<void> {
        const values = [

            model.role_id,

            model.permission_id,


            model.role_permission_id,

        ];
        await client.query(
            `UPDATE "MasterRolePermission" SET

    "role_id" = $${ 0 + 1 }
,
    "permission_id" = $${ 1 + 1 }

WHERE
     "role_permission_id" = $${ 0 + 2 + 1 }
`,
            values);
    }

    static async upsert(client: PgClient, model: MasterRolePermission$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: MasterRolePermissionPk$): Promise<void> {
        const values = [

            pk.role_permission_id,

        ];
        await client.query(
            `DELETE FROM "MasterRolePermission"
WHERE

     "role_permission_id" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: MasterRolePermissionPk$): Promise<MasterRolePermission$ | null> {
        const values = [

            pk.role_permission_id,

        ];
        const res = await client.query(
            `SELECT *
FROM "MasterRolePermission"
WHERE

     "role_permission_id" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new MasterRolePermission$(res.rows[0] as MasterRolePermissionProp$);
    }




}
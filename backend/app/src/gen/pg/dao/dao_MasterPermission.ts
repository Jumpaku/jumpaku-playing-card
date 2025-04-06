export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type MasterPermissionProp$ = {

    permission_id: string;

    permission_name: string;

};

export type MasterPermissionPk$ = {

    permission_id: string;

};



export type MasterPermission_Finduk_masterpermission_nameKey$ = {
    
    permission_name: string;
    
};



export type MasterPermission_Listuk_masterpermission_nameKey$ = {
    
    permission_name?: string;
    
};


export class MasterPermission$ {
    constructor(props: MasterPermissionProp$) {

        this.permission_id = props.permission_id;

        this.permission_name = props.permission_name;

    }


    permission_id: string;

    permission_name: string;


    static async insert(client: PgClient, ...models: MasterPermission$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.permission_id,

            model.permission_name,

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
        await client.query(`INSERT INTO "MasterPermission" (

    "permission_id"
,
    "permission_name"

) VALUES ${params}`,
            values,
        );
    }

    static async update(client: PgClient, model: MasterPermission$): Promise<void> {
        const values = [

            model.permission_name,


            model.permission_id,

        ];
        await client.query(
            `UPDATE "MasterPermission" SET

    "permission_name" = $${ 0 + 1 }

WHERE
     "permission_id" = $${ 0 + 1 + 1 }
`,
            values);
    }

    static async upsert(client: PgClient, model: MasterPermission$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: MasterPermissionPk$): Promise<void> {
        const values = [

            pk.permission_id,

        ];
        await client.query(
            `DELETE FROM "MasterPermission"
WHERE

     "permission_id" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: MasterPermissionPk$): Promise<MasterPermission$ | null> {
        const values = [

            pk.permission_id,

        ];
        const res = await client.query(
            `SELECT *
FROM "MasterPermission"
WHERE

     "permission_id" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new MasterPermission$(res.rows[0] as MasterPermissionProp$);
    }


    static async findByuk_masterpermission_name(client: PgClient, key: MasterPermission_Finduk_masterpermission_nameKey$): Promise<MasterPermission$ | null> {
        const params: string[] = [];
        let stmt: string = `SELECT *
FROM "MasterPermission"
WHERE `;
    
        params.push(key.permission_name);
        if (params.length > 1) {
            stmt += " AND ";
        }
        stmt += `"permission_name" = $${params.length}`;
    
        stmt += " LIMIT 1";
        const res = await client.query(stmt, params);
        if (res.rows.length === 0) {
            return null;
        }
        return new MasterPermission$(res.rows[0] as any);
    }



    static async listByuk_masterpermission_name(client: PgClient, key: MasterPermission_Listuk_masterpermission_nameKey$): Promise<MasterPermission$[]> {
        const params: string[] = [];
        let stmt: string = `SELECT *
FROM "MasterPermission"
WHERE `;
    
        if (key.permission_name !== undefined) {
            params.push(key.permission_name);
            if (params.length > 1) {
                stmt += " AND ";
            }
            stmt += `"permission_name" = $${params.length}`;
        }
    
        if (params.length === 0) {
            throw new Error("No key provided");
        }
        const res = await client.query(stmt, params);
        return res.rows.map((row: any) => new MasterPermission$(row));
    }

}
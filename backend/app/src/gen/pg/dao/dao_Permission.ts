export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type PermissionProp$ = {

    permission_id: string;

    name: string;

    create_time: Date;

    update_time: Date;

};

export type PermissionPk$ = {

    permission_id: string;

};



export type Permission_Finduk_permission_nameKey$ = {
    
    name: string;
    
};



export type Permission_Listuk_permission_nameKey$ = {
    
    name?: string;
    
};


export class Permission$ {
    constructor(props: PermissionProp$) {

        this.permission_id = props.permission_id;

        this.name = props.name;

        this.create_time = props.create_time;

        this.update_time = props.update_time;

    }


    permission_id: string;

    name: string;

    create_time: Date;

    update_time: Date;


    static async insert(client: PgClient, ...models: Permission$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.permission_id,

            model.name,

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
        await client.query(`INSERT INTO "Permission" (

    "permission_id"
,
    "name"
,
    "create_time"
,
    "update_time"

) VALUES ${params}`,
            values,
        );
    }

    static async update(client: PgClient, model: Permission$): Promise<void> {
        const values = [

            model.name,

            model.create_time,

            model.update_time,


            model.permission_id,

        ];
        await client.query(
            `UPDATE "Permission" SET

    "name" = $${ 0 + 1 }
,
    "create_time" = $${ 1 + 1 }
,
    "update_time" = $${ 2 + 1 }

WHERE
     "permission_id" = $${ 0 + 3 + 1 }
`,
            values);
    }

    static async upsert(client: PgClient, model: Permission$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: PermissionPk$): Promise<void> {
        const values = [

            pk.permission_id,

        ];
        await client.query(
            `DELETE FROM "Permission"
WHERE

     "permission_id" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: PermissionPk$): Promise<Permission$ | null> {
        const values = [

            pk.permission_id,

        ];
        const res = await client.query(
            `SELECT *
FROM "Permission"
WHERE

     "permission_id" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new Permission$(res.rows[0] as PermissionProp$);
    }


    static async findByuk_permission_name(client: PgClient, key: Permission_Finduk_permission_nameKey$): Promise<Permission$ | null> {
        const params: string[] = [];
        let stmt: string = `SELECT *
FROM "Permission"
WHERE `;
    
        params.push(key.name);
        if (params.length > 1) {
            stmt += " AND ";
        }
        stmt += `"name" = $${params.length}`;
    
        stmt += " LIMIT 1";
        const res = await client.query(stmt, params);
        if (res.rows.length === 0) {
            return null;
        }
        return new Permission$(res.rows[0] as any);
    }



    static async listByuk_permission_name(client: PgClient, key: Permission_Listuk_permission_nameKey$): Promise<Permission$[]> {
        const params: string[] = [];
        let stmt: string = `SELECT *
FROM "Permission"
WHERE `;
    
        if (key.name !== undefined) {
            params.push(key.name);
            if (params.length > 1) {
                stmt += " AND ";
            }
            stmt += `"name" = $${params.length}`;
        }
    
        if (params.length === 0) {
            throw new Error("No key provided");
        }
        const res = await client.query(stmt, params);
        return res.rows.map((row: any) => new Permission$(row));
    }

}
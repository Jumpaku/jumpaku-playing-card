export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type MasterRoleProp$ = {

    role_id: string;

    role_name: string;

};

export type MasterRolePk$ = {

    role_id: string;

};



export type MasterRole_Finduk_masterrole_nameKey$ = {
    
    role_name: string;
    
};



export type MasterRole_Listuk_masterrole_nameKey$ = {
    
    role_name?: string;
    
};


export class MasterRole$ {
    constructor(props: MasterRoleProp$) {

        this.role_id = props.role_id;

        this.role_name = props.role_name;

    }


    role_id: string;

    role_name: string;


    static async insert(client: PgClient, ...models: MasterRole$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.role_id,

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
        await client.query(`INSERT INTO "MasterRole" (

    "role_id"
,
    "role_name"

) VALUES ${params}`,
            values,
        );
    }

    static async update(client: PgClient, model: MasterRole$): Promise<void> {
        const values = [

            model.role_name,


            model.role_id,

        ];
        await client.query(
            `UPDATE "MasterRole" SET

    "role_name" = $${ 0 + 1 }

WHERE
     "role_id" = $${ 0 + 1 + 1 }
`,
            values);
    }

    static async upsert(client: PgClient, model: MasterRole$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: MasterRolePk$): Promise<void> {
        const values = [

            pk.role_id,

        ];
        await client.query(
            `DELETE FROM "MasterRole"
WHERE

     "role_id" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: MasterRolePk$): Promise<MasterRole$ | null> {
        const values = [

            pk.role_id,

        ];
        const res = await client.query(
            `SELECT *
FROM "MasterRole"
WHERE

     "role_id" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new MasterRole$(res.rows[0] as MasterRoleProp$);
    }


    static async findByuk_masterrole_name(client: PgClient, key: MasterRole_Finduk_masterrole_nameKey$): Promise<MasterRole$ | null> {
        const params: unknown[] = [];
        let stmt: string = `SELECT *
FROM "MasterRole"
WHERE `;
    
        params.push(key.role_name);
        if (params.length > 1) {
            stmt += " AND ";
        }
        stmt += `"role_name" = $${params.length}`;
    
        stmt += " LIMIT 1";
        const res = await client.query(stmt, params);
        if (res.rows.length === 0) {
            return null;
        }
        return new MasterRole$(res.rows[0] as any);
    }



    static async listByuk_masterrole_name(client: PgClient, key: MasterRole_Listuk_masterrole_nameKey$): Promise<MasterRole$[]> {
        const params: unknown[] = [];
        let stmt: string = `SELECT *
FROM "MasterRole"
WHERE `;
    
        if (key.role_name !== undefined) {
            params.push(key.role_name);
            if (params.length > 1) {
                stmt += " AND ";
            }
            stmt += `"role_name" = $${params.length}`;
        }
    
        if (params.length === 0) {
            throw new Error("No key provided");
        }
        const res = await client.query(stmt, params);
        return res.rows.map((row: any) => new MasterRole$(row));
    }

}
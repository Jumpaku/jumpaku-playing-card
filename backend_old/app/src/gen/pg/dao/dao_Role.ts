export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type RoleProp$ = {

    role_id: string;

    name: string;

    create_time: Date;

    update_time: Date;

};

export type RolePk$ = {

    role_id: string;

};



export type Role_Finduk_role_nameKey$ = {
    
    name: string;
    
};



export type Role_Listuk_role_nameKey$ = {
    
    name?: string;
    
};


export class Role$ {
    constructor(props: RoleProp$) {

        this.role_id = props.role_id;

        this.name = props.name;

        this.create_time = props.create_time;

        this.update_time = props.update_time;

    }


    role_id: string;

    name: string;

    create_time: Date;

    update_time: Date;


    static async insert(client: PgClient, ...models: Role$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.role_id,

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
        await client.query(`INSERT INTO "Role" (

    "role_id"
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

    static async update(client: PgClient, model: Role$): Promise<void> {
        const values = [

            model.name,

            model.create_time,

            model.update_time,


            model.role_id,

        ];
        await client.query(
            `UPDATE "Role" SET

    "name" = $${ 0 + 1 }
,
    "create_time" = $${ 1 + 1 }
,
    "update_time" = $${ 2 + 1 }

WHERE
     "role_id" = $${ 0 + 3 + 1 }
`,
            values);
    }

    static async upsert(client: PgClient, model: Role$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: RolePk$): Promise<void> {
        const values = [

            pk.role_id,

        ];
        await client.query(
            `DELETE FROM "Role"
WHERE

     "role_id" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: RolePk$): Promise<Role$ | null> {
        const values = [

            pk.role_id,

        ];
        const res = await client.query(
            `SELECT *
FROM "Role"
WHERE

     "role_id" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new Role$(res.rows[0] as RoleProp$);
    }


    static async findByuk_role_name(client: PgClient, key: Role_Finduk_role_nameKey$): Promise<Role$ | null> {
        const params: string[] = [];
        let stmt: string = `SELECT *
FROM "Role"
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
        return new Role$(res.rows[0] as any);
    }



    static async listByuk_role_name(client: PgClient, key: Role_Listuk_role_nameKey$): Promise<Role$[]> {
        const params: string[] = [];
        let stmt: string = `SELECT *
FROM "Role"
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
        return res.rows.map((row: any) => new Role$(row));
    }

}
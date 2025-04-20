export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type UserAuthenticationProp$ = {

    user_authentication_id: string;

    user_id: string;

    authentication_id: string;

    create_time: Date;

    update_time: Date;

};

export type UserAuthenticationPk$ = {

    user_authentication_id: string;

};



export type UserAuthentication_FindUk_UserAuthenticationKey$ = {
    
    user_id: string;
    
    authentication_id: string;
    
};



export type UserAuthentication_ListUk_UserAuthenticationKey$ = {
    
    user_id?: string;
    
    authentication_id?: string;
    
};


export class UserAuthentication$ {
    constructor(props: UserAuthenticationProp$) {

        this.user_authentication_id = props.user_authentication_id;

        this.user_id = props.user_id;

        this.authentication_id = props.authentication_id;

        this.create_time = props.create_time;

        this.update_time = props.update_time;

    }


    user_authentication_id: string;

    user_id: string;

    authentication_id: string;

    create_time: Date;

    update_time: Date;


    static async insert(client: PgClient, ...models: UserAuthentication$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.user_authentication_id,

            model.user_id,

            model.authentication_id,

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
        await client.query(`INSERT INTO "UserAuthentication" (

    "user_authentication_id"
,
    "user_id"
,
    "authentication_id"
,
    "create_time"
,
    "update_time"

) VALUES ${params}`,
            values,
        );
    }

    static async update(client: PgClient, model: UserAuthentication$): Promise<void> {
        const values = [

            model.user_id,

            model.authentication_id,

            model.create_time,

            model.update_time,


            model.user_authentication_id,

        ];
        await client.query(
            `UPDATE "UserAuthentication" SET

    "user_id" = $${ 0 + 1 }
,
    "authentication_id" = $${ 1 + 1 }
,
    "create_time" = $${ 2 + 1 }
,
    "update_time" = $${ 3 + 1 }

WHERE
     "user_authentication_id" = $${ 0 + 4 + 1 }
`,
            values);
    }

    static async upsert(client: PgClient, model: UserAuthentication$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: UserAuthenticationPk$): Promise<void> {
        const values = [

            pk.user_authentication_id,

        ];
        await client.query(
            `DELETE FROM "UserAuthentication"
WHERE

     "user_authentication_id" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: UserAuthenticationPk$): Promise<UserAuthentication$ | null> {
        const values = [

            pk.user_authentication_id,

        ];
        const res = await client.query(
            `SELECT *
FROM "UserAuthentication"
WHERE

     "user_authentication_id" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new UserAuthentication$(res.rows[0] as UserAuthenticationProp$);
    }


    static async findByUk_UserAuthentication(client: PgClient, key: UserAuthentication_FindUk_UserAuthenticationKey$): Promise<UserAuthentication$ | null> {
        const params: unknown[] = [];
        let stmt: string = `SELECT *
FROM "UserAuthentication"
WHERE `;
    
        params.push(key.user_id);
        if (params.length > 1) {
            stmt += " AND ";
        }
        stmt += `"user_id" = $${params.length}`;
    
        params.push(key.authentication_id);
        if (params.length > 1) {
            stmt += " AND ";
        }
        stmt += `"authentication_id" = $${params.length}`;
    
        stmt += " LIMIT 1";
        const res = await client.query(stmt, params);
        if (res.rows.length === 0) {
            return null;
        }
        return new UserAuthentication$(res.rows[0] as any);
    }



    static async listByUk_UserAuthentication(client: PgClient, key: UserAuthentication_ListUk_UserAuthenticationKey$): Promise<UserAuthentication$[]> {
        const params: unknown[] = [];
        let stmt: string = `SELECT *
FROM "UserAuthentication"
WHERE `;
    
        if (key.user_id !== undefined) {
            params.push(key.user_id);
            if (params.length > 1) {
                stmt += " AND ";
            }
            stmt += `"user_id" = $${params.length}`;
        }
    
        if (key.authentication_id !== undefined) {
            params.push(key.authentication_id);
            if (params.length > 1) {
                stmt += " AND ";
            }
            stmt += `"authentication_id" = $${params.length}`;
        }
    
        if (params.length === 0) {
            throw new Error("No key provided");
        }
        const res = await client.query(stmt, params);
        return res.rows.map((row: any) => new UserAuthentication$(row));
    }

}
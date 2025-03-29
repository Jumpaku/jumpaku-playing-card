export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type AuthenticationPasswordProp$ = {

    authentication_id: string;

    login_id: string;

    password_salt: string;

    password_hash: string;

    create_time: Date;

    update_time: Date;

};

export type AuthenticationPasswordPk$ = {

    authentication_id: string;

};



export type AuthenticationPassword_FindUk_AuthenticationPassword_LoginIdKey$ = {
    
    login_id: string;
    
};



export type AuthenticationPassword_ListUk_AuthenticationPassword_LoginIdKey$ = {
    
    login_id?: string;
    
};


export class AuthenticationPassword$ {
    constructor(props: AuthenticationPasswordProp$) {

        this.authentication_id = props.authentication_id;

        this.login_id = props.login_id;

        this.password_salt = props.password_salt;

        this.password_hash = props.password_hash;

        this.create_time = props.create_time;

        this.update_time = props.update_time;

    }


    authentication_id: string;

    login_id: string;

    password_salt: string;

    password_hash: string;

    create_time: Date;

    update_time: Date;


    static async insert(client: PgClient, ...models: AuthenticationPassword$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.authentication_id,

            model.login_id,

            model.password_salt,

            model.password_hash,

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
        await client.query(`INSERT INTO "AuthenticationPassword" (

    "authentication_id"
,
    "login_id"
,
    "password_salt"
,
    "password_hash"
,
    "create_time"
,
    "update_time"

) VALUES ${params}`,
            values,
        );
    }

    static async update(client: PgClient, model: AuthenticationPassword$): Promise<void> {
        const values = [

            model.login_id,

            model.password_salt,

            model.password_hash,

            model.create_time,

            model.update_time,


            model.authentication_id,

        ];
        await client.query(
            `UPDATE "AuthenticationPassword" SET

    "login_id" = $${ 0 + 1 }
,
    "password_salt" = $${ 1 + 1 }
,
    "password_hash" = $${ 2 + 1 }
,
    "create_time" = $${ 3 + 1 }
,
    "update_time" = $${ 4 + 1 }

WHERE
     "authentication_id" = $${ 0 + 5 + 1 }
`,
            values);
    }

    static async upsert(client: PgClient, model: AuthenticationPassword$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: AuthenticationPasswordPk$): Promise<void> {
        const values = [

            pk.authentication_id,

        ];
        await client.query(
            `DELETE FROM "AuthenticationPassword"
WHERE

     "authentication_id" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: AuthenticationPasswordPk$): Promise<AuthenticationPassword$ | null> {
        const values = [

            pk.authentication_id,

        ];
        const res = await client.query(
            `SELECT *
FROM "AuthenticationPassword"
WHERE

     "authentication_id" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new AuthenticationPassword$(res.rows[0] as AuthenticationPasswordProp$);
    }


    static async findByUk_AuthenticationPassword_LoginId(client: PgClient, key: AuthenticationPassword_FindUk_AuthenticationPassword_LoginIdKey$): Promise<AuthenticationPassword$ | null> {
        const params: string[] = [];
        let stmt: string = `SELECT *
FROM "AuthenticationPassword"
WHERE `;
    
        params.push(key.login_id);
        if (params.length > 1) {
            stmt += " AND ";
        }
        stmt += `"login_id" = $${params.length}`;
    
        stmt += " LIMIT 1";
        const res = await client.query(stmt, params);
        if (res.rows.length === 0) {
            return null;
        }
        return new AuthenticationPassword$(res.rows[0] as any);
    }



    static async listByUk_AuthenticationPassword_LoginId(client: PgClient, key: AuthenticationPassword_ListUk_AuthenticationPassword_LoginIdKey$): Promise<AuthenticationPassword$[]> {
        const params: string[] = [];
        let stmt: string = `SELECT *
FROM "AuthenticationPassword"
WHERE `;
    
        if (key.login_id !== undefined) {
            params.push(key.login_id);
            if (params.length > 1) {
                stmt += " AND ";
            }
            stmt += `"login_id" = $${params.length}`;
        }
    
        if (params.length === 0) {
            throw new Error("No key provided");
        }
        const res = await client.query(stmt, params);
        return res.rows.map((row: any) => new AuthenticationPassword$(row));
    }

}
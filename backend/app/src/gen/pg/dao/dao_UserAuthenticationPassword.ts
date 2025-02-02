export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type UserAuthenticationPasswordProp$ = {

    user_authentication_id: string;

    password_salt: string;

    password_hash: string;

    create_time: Date;

    update_time: Date;

};

export type UserAuthenticationPasswordPk$ = {

    user_authentication_id: string;

};




export class UserAuthenticationPassword$ {
    constructor(props: UserAuthenticationPasswordProp$) {

        this.user_authentication_id = props.user_authentication_id;

        this.password_salt = props.password_salt;

        this.password_hash = props.password_hash;

        this.create_time = props.create_time;

        this.update_time = props.update_time;

    }


    user_authentication_id: string;

    password_salt: string;

    password_hash: string;

    create_time: Date;

    update_time: Date;


    static async insert(client: PgClient, ...models: UserAuthenticationPassword$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.user_authentication_id,

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
        await client.query(`INSERT INTO "UserAuthenticationPassword" (

    "user_authentication_id"
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

    static async update(client: PgClient, model: UserAuthenticationPassword$): Promise<void> {
        const values = [

            model.password_salt,

            model.password_hash,

            model.create_time,

            model.update_time,


            model.user_authentication_id,

        ];
        await client.query(
            `UPDATE "UserAuthenticationPassword" SET

    "password_salt" = $${ 0 + 1 }
,
    "password_hash" = $${ 1 + 1 }
,
    "create_time" = $${ 2 + 1 }
,
    "update_time" = $${ 3 + 1 }

WHERE
     "user_authentication_id" = $${ 0 + 4 + 1 }
`,
            values);
    }

    static async upsert(client: PgClient, model: UserAuthenticationPassword$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: UserAuthenticationPasswordPk$): Promise<void> {
        const values = [

            pk.user_authentication_id,

        ];
        await client.query(
            `DELETE FROM "UserAuthenticationPassword"
WHERE

     "user_authentication_id" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: UserAuthenticationPasswordPk$): Promise<UserAuthenticationPassword$ | null> {
        const values = [

            pk.user_authentication_id,

        ];
        const res = await client.query(
            `SELECT *
FROM "UserAuthenticationPassword"
WHERE

     "user_authentication_id" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new UserAuthenticationPassword$(res.rows[0] as UserAuthenticationPasswordProp$);
    }


}
export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type UserSessionProp$ = {

    session_id: string;

    user_id: string;

    expire_time?: Date | null;

    create_time: Date;

    update_time: Date;

};

export type UserSessionPk$ = {

    session_id: string;

};






export class UserSession$ {
    constructor(props: UserSessionProp$) {

        this.session_id = props.session_id;

        this.user_id = props.user_id;

        this.expire_time = props.expire_time ?? null;

        this.create_time = props.create_time;

        this.update_time = props.update_time;

    }


    session_id: string;

    user_id: string;

    expire_time: Date | null;

    create_time: Date;

    update_time: Date;


    static async insert(client: PgClient, ...models: UserSession$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.session_id,

            model.user_id,

            model.expire_time,

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
        await client.query(`INSERT INTO "UserSession" (

    "session_id"
,
    "user_id"
,
    "expire_time"
,
    "create_time"
,
    "update_time"

) VALUES ${params}`,
            values,
        );
    }

    static async update(client: PgClient, model: UserSession$): Promise<void> {
        const values = [

            model.user_id,

            model.expire_time,

            model.create_time,

            model.update_time,


            model.session_id,

        ];
        await client.query(
            `UPDATE "UserSession" SET

    "user_id" = $${ 0 + 1 }
,
    "expire_time" = $${ 1 + 1 }
,
    "create_time" = $${ 2 + 1 }
,
    "update_time" = $${ 3 + 1 }

WHERE
     "session_id" = $${ 0 + 4 + 1 }
`,
            values);
    }

    static async upsert(client: PgClient, model: UserSession$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: UserSessionPk$): Promise<void> {
        const values = [

            pk.session_id,

        ];
        await client.query(
            `DELETE FROM "UserSession"
WHERE

     "session_id" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: UserSessionPk$): Promise<UserSession$ | null> {
        const values = [

            pk.session_id,

        ];
        const res = await client.query(
            `SELECT *
FROM "UserSession"
WHERE

     "session_id" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new UserSession$(res.rows[0] as UserSessionProp$);
    }




}
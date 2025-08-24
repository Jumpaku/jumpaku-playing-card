export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type AuthenticationProp$ = {

    authentication_id: string;

    auth_method: string;

    create_time: Date;

    update_time: Date;

};

export type AuthenticationPk$ = {

    authentication_id: string;

};






export class Authentication$ {
    constructor(props: AuthenticationProp$) {

        this.authentication_id = props.authentication_id;

        this.auth_method = props.auth_method;

        this.create_time = props.create_time;

        this.update_time = props.update_time;

    }


    authentication_id: string;

    auth_method: string;

    create_time: Date;

    update_time: Date;


    static async insert(client: PgClient, ...models: Authentication$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.authentication_id,

            model.auth_method,

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
        await client.query(`INSERT INTO "Authentication" (

    "authentication_id"
,
    "auth_method"
,
    "create_time"
,
    "update_time"

) VALUES ${params}`,
            values,
        );
    }

    static async update(client: PgClient, model: Authentication$): Promise<void> {
        const values = [

            model.auth_method,

            model.create_time,

            model.update_time,


            model.authentication_id,

        ];
        await client.query(
            `UPDATE "Authentication" SET

    "auth_method" = $${ 0 + 1 }
,
    "create_time" = $${ 1 + 1 }
,
    "update_time" = $${ 2 + 1 }

WHERE
     "authentication_id" = $${ 0 + 3 + 1 }
`,
            values);
    }

    static async upsert(client: PgClient, model: Authentication$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: AuthenticationPk$): Promise<void> {
        const values = [

            pk.authentication_id,

        ];
        await client.query(
            `DELETE FROM "Authentication"
WHERE

     "authentication_id" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: AuthenticationPk$): Promise<Authentication$ | null> {
        const values = [

            pk.authentication_id,

        ];
        const res = await client.query(
            `SELECT *
FROM "Authentication"
WHERE

     "authentication_id" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new Authentication$(res.rows[0] as AuthenticationProp$);
    }




}
export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type UserProp$ = {

    user_id: string;

    create_time: Date;

    update_time: Date;

};

export type UserPk$ = {

    user_id: string;

};






export class User$ {
    constructor(props: UserProp$) {

        this.user_id = props.user_id;

        this.create_time = props.create_time;

        this.update_time = props.update_time;

    }


    user_id: string;

    create_time: Date;

    update_time: Date;


    static async insert(client: PgClient, ...models: User$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.user_id,

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
        await client.query(`INSERT INTO "User" (

    "user_id"
,
    "create_time"
,
    "update_time"

) VALUES ${params}`,
            values,
        );
    }

    static async update(client: PgClient, model: User$): Promise<void> {
        const values = [

            model.create_time,

            model.update_time,


            model.user_id,

        ];
        await client.query(
            `UPDATE "User" SET

    "create_time" = $${ 0 + 1 }
,
    "update_time" = $${ 1 + 1 }

WHERE
     "user_id" = $${ 0 + 2 + 1 }
`,
            values);
    }

    static async upsert(client: PgClient, model: User$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: UserPk$): Promise<void> {
        const values = [

            pk.user_id,

        ];
        await client.query(
            `DELETE FROM "User"
WHERE

     "user_id" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: UserPk$): Promise<User$ | null> {
        const values = [

            pk.user_id,

        ];
        const res = await client.query(
            `SELECT *
FROM "User"
WHERE

     "user_id" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new User$(res.rows[0] as UserProp$);
    }




}
export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type UserRoleProp$ = {

    user_role_id: string;

    user_id: string;

    role_id: string;

    create_time: Date;

    update_time: Date;

};

export type UserRolePk$ = {

    user_role_id: string;

};






export class UserRole$ {
    constructor(props: UserRoleProp$) {

        this.user_role_id = props.user_role_id;

        this.user_id = props.user_id;

        this.role_id = props.role_id;

        this.create_time = props.create_time;

        this.update_time = props.update_time;

    }


    user_role_id: string;

    user_id: string;

    role_id: string;

    create_time: Date;

    update_time: Date;


    static async insert(client: PgClient, ...models: UserRole$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.user_role_id,

            model.user_id,

            model.role_id,

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
        await client.query(`INSERT INTO "UserRole" (

    "user_role_id"
,
    "user_id"
,
    "role_id"
,
    "create_time"
,
    "update_time"

) VALUES ${params}`,
            values,
        );
    }

    static async update(client: PgClient, model: UserRole$): Promise<void> {
        const values = [

            model.user_id,

            model.role_id,

            model.create_time,

            model.update_time,


            model.user_role_id,

        ];
        await client.query(
            `UPDATE "UserRole" SET

    "user_id" = $${ 0 + 1 }
,
    "role_id" = $${ 1 + 1 }
,
    "create_time" = $${ 2 + 1 }
,
    "update_time" = $${ 3 + 1 }

WHERE
     "user_role_id" = $${ 0 + 4 + 1 }
`,
            values);
    }

    static async upsert(client: PgClient, model: UserRole$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: UserRolePk$): Promise<void> {
        const values = [

            pk.user_role_id,

        ];
        await client.query(
            `DELETE FROM "UserRole"
WHERE

     "user_role_id" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: UserRolePk$): Promise<UserRole$ | null> {
        const values = [

            pk.user_role_id,

        ];
        const res = await client.query(
            `SELECT *
FROM "UserRole"
WHERE

     "user_role_id" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new UserRole$(res.rows[0] as UserRoleProp$);
    }




}
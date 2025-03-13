export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type SessionProp$ = {

    session_id: string;

    authentication_id: string;

    expire_time?: Date | null;

    create_time: Date;

    update_time: Date;

};

export type SessionPk$ = {

    session_id: string;

};






export class Session$ {
    constructor(props: SessionProp$) {

        this.session_id = props.session_id;

        this.authentication_id = props.authentication_id;

        this.expire_time = props.expire_time ?? null;

        this.create_time = props.create_time;

        this.update_time = props.update_time;

    }


    session_id: string;

    authentication_id: string;

    expire_time: Date | null;

    create_time: Date;

    update_time: Date;


    static async insert(client: PgClient, ...models: Session$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.session_id,

            model.authentication_id,

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
        await client.query(`INSERT INTO "Session" (

    "session_id"
,
    "authentication_id"
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

    static async update(client: PgClient, model: Session$): Promise<void> {
        const values = [

            model.authentication_id,

            model.expire_time,

            model.create_time,

            model.update_time,


            model.session_id,

        ];
        await client.query(
            `UPDATE "Session" SET

    "authentication_id" = $${ 0 + 1 }
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

    static async upsert(client: PgClient, model: Session$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: SessionPk$): Promise<void> {
        const values = [

            pk.session_id,

        ];
        await client.query(
            `DELETE FROM "Session"
WHERE

     "session_id" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: SessionPk$): Promise<Session$ | null> {
        const values = [

            pk.session_id,

        ];
        const res = await client.query(
            `SELECT *
FROM "Session"
WHERE

     "session_id" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new Session$(res.rows[0] as SessionProp$);
    }




}
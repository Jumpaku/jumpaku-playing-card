export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type schema_migrationsProp$ = {

    version: bigint;

    dirty: boolean;

};

export type schema_migrationsPk$ = {

    version: bigint;

};






export class schema_migrations$ {
    constructor(props: schema_migrationsProp$) {

        this.version = props.version;

        this.dirty = props.dirty;

    }


    version: bigint;

    dirty: boolean;


    static async insert(client: PgClient, ...models: schema_migrations$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.version,

            model.dirty,

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
        await client.query(`INSERT INTO "schema_migrations" (

    "version"
,
    "dirty"

) VALUES ${params}`,
            values,
        );
    }

    static async update(client: PgClient, model: schema_migrations$): Promise<void> {
        const values = [

            model.dirty,


            model.version,

        ];
        await client.query(
            `UPDATE "schema_migrations" SET

    "dirty" = $${ 0 + 1 }

WHERE
     "version" = $${ 0 + 1 + 1 }
`,
            values);
    }

    static async upsert(client: PgClient, model: schema_migrations$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: schema_migrationsPk$): Promise<void> {
        const values = [

            pk.version,

        ];
        await client.query(
            `DELETE FROM "schema_migrations"
WHERE

     "version" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: schema_migrationsPk$): Promise<schema_migrations$ | null> {
        const values = [

            pk.version,

        ];
        const res = await client.query(
            `SELECT *
FROM "schema_migrations"
WHERE

     "version" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new schema_migrations$(res.rows[0] as schema_migrationsProp$);
    }




}
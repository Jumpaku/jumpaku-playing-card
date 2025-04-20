export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type ExampleProp$ = {

    example_id: string;

    name: string;

    content: string;

    create_time: Date;

    update_time: Date;

};

export type ExamplePk$ = {

    example_id: string;

};






export class Example$ {
    constructor(props: ExampleProp$) {

        this.example_id = props.example_id;

        this.name = props.name;

        this.content = props.content;

        this.create_time = props.create_time;

        this.update_time = props.update_time;

    }


    example_id: string;

    name: string;

    content: string;

    create_time: Date;

    update_time: Date;


    static async insert(client: PgClient, ...models: Example$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.example_id,

            model.name,

            model.content,

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
        await client.query(`INSERT INTO "Example" (

    "example_id"
,
    "name"
,
    "content"
,
    "create_time"
,
    "update_time"

) VALUES ${params}`,
            values,
        );
    }

    static async update(client: PgClient, model: Example$): Promise<void> {
        const values = [

            model.name,

            model.content,

            model.create_time,

            model.update_time,


            model.example_id,

        ];
        await client.query(
            `UPDATE "Example" SET

    "name" = $${ 0 + 1 }
,
    "content" = $${ 1 + 1 }
,
    "create_time" = $${ 2 + 1 }
,
    "update_time" = $${ 3 + 1 }

WHERE
     "example_id" = $${ 0 + 4 + 1 }
`,
            values);
    }

    static async upsert(client: PgClient, model: Example$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: ExamplePk$): Promise<void> {
        const values = [

            pk.example_id,

        ];
        await client.query(
            `DELETE FROM "Example"
WHERE

     "example_id" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: ExamplePk$): Promise<Example$ | null> {
        const values = [

            pk.example_id,

        ];
        const res = await client.query(
            `SELECT *
FROM "Example"
WHERE

     "example_id" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new Example$(res.rows[0] as ExampleProp$);
    }




}
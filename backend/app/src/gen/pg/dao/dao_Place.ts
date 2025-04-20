export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type PlaceProp$ = {

    place_id: string;

    room_id: string;

    display_name: string;

    create_time: Date;

    update_time: Date;

};

export type PlacePk$ = {

    place_id: string;

};






export class Place$ {
    constructor(props: PlaceProp$) {

        this.place_id = props.place_id;

        this.room_id = props.room_id;

        this.display_name = props.display_name;

        this.create_time = props.create_time;

        this.update_time = props.update_time;

    }


    place_id: string;

    room_id: string;

    display_name: string;

    create_time: Date;

    update_time: Date;


    static async insert(client: PgClient, ...models: Place$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.place_id,

            model.room_id,

            model.display_name,

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
        await client.query(`INSERT INTO "Place" (

    "place_id"
,
    "room_id"
,
    "display_name"
,
    "create_time"
,
    "update_time"

) VALUES ${params}`,
            values,
        );
    }

    static async update(client: PgClient, model: Place$): Promise<void> {
        const values = [

            model.room_id,

            model.display_name,

            model.create_time,

            model.update_time,


            model.place_id,

        ];
        await client.query(
            `UPDATE "Place" SET

    "room_id" = $${ 0 + 1 }
,
    "display_name" = $${ 1 + 1 }
,
    "create_time" = $${ 2 + 1 }
,
    "update_time" = $${ 3 + 1 }

WHERE
     "place_id" = $${ 0 + 4 + 1 }
`,
            values);
    }

    static async upsert(client: PgClient, model: Place$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: PlacePk$): Promise<void> {
        const values = [

            pk.place_id,

        ];
        await client.query(
            `DELETE FROM "Place"
WHERE

     "place_id" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: PlacePk$): Promise<Place$ | null> {
        const values = [

            pk.place_id,

        ];
        const res = await client.query(
            `SELECT *
FROM "Place"
WHERE

     "place_id" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new Place$(res.rows[0] as PlaceProp$);
    }




}
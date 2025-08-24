export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type MasterCardProp$ = {

    card_id: string;

    suit: string;

    rank: string;

};

export type MasterCardPk$ = {

    card_id: string;

};






export class MasterCard$ {
    constructor(props: MasterCardProp$) {

        this.card_id = props.card_id;

        this.suit = props.suit;

        this.rank = props.rank;

    }


    card_id: string;

    suit: string;

    rank: string;


    static async insert(client: PgClient, ...models: MasterCard$[]): Promise<void> {
        const values = models.flatMap((model) => [

            model.card_id,

            model.suit,

            model.rank,

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
        await client.query(`INSERT INTO "MasterCard" (

    "card_id"
,
    "suit"
,
    "rank"

) VALUES ${params}`,
            values,
        );
    }

    static async update(client: PgClient, model: MasterCard$): Promise<void> {
        const values = [

            model.suit,

            model.rank,


            model.card_id,

        ];
        await client.query(
            `UPDATE "MasterCard" SET

    "suit" = $${ 0 + 1 }
,
    "rank" = $${ 1 + 1 }

WHERE
     "card_id" = $${ 0 + 2 + 1 }
`,
            values);
    }

    static async upsert(client: PgClient, model: MasterCard$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: MasterCardPk$): Promise<void> {
        const values = [

            pk.card_id,

        ];
        await client.query(
            `DELETE FROM "MasterCard"
WHERE

     "card_id" = $${ 0 + 1 }
`,
            values);
    }

    static async find(client: PgClient, pk: MasterCardPk$): Promise<MasterCard$ | null> {
        const values = [

            pk.card_id,

        ];
        const res = await client.query(
            `SELECT *
FROM "MasterCard"
WHERE

     "card_id" = $${ 0 + 1 }

LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new MasterCard$(res.rows[0] as MasterCardProp$);
    }




}
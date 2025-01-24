export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

export type {{.Name}}Prop$ = {
{{range $Index, $Column := .Columns}}
    {{$Column.Name}}{{if .Nullable}}?{{end}}: {{$Column.TsType}};
{{end}}
};

export type {{.Name}}Pk$ = {
{{range $Index, $Key := .PrimaryKey}}
    {{$Key.Name}}: {{$Key.TsType}};
{{end}}
};

{{$TableName := .Name}}
{{range .Index}}
export type {{$TableName}}_{{.Name}}Key$ = {
    {{range $Index, $Key := .Keys}}
    {{$Key.Name}}?: {{$Key.TsType}};
    {{end}}
};
{{end}}

export class {{.Name}}$ {
    constructor(props: {{.Name}}Prop$) {
{{range $Index, $Column := .Columns}}
        this.{{$Column.Name}} = props.{{$Column.Name}}{{if .Nullable}} ?? null{{end}};
{{end}}
    }

{{range $Index, $Column := .Columns}}
    {{$Column.Name}}: {{$Column.TsType}};
{{end}}

    static async insert(client: PgClient, ...models: {{.Name}}$[]): Promise<void> {
        const values = models.flatMap((model) => [
{{range $Index, $Column := .Columns}}
            model.{{$Column.Name}},
{{end}}
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
        await client.query(`INSERT INTO "{{.Name}}" (
{{range $Index, $Column := .Columns}}{{if $Index}},{{end}}
    "{{$Column.Name}}"
{{end}}
) VALUES ${params}`,
            values,
        );
    }

    static async update(client: PgClient, model: {{.Name}}$): Promise<void> {
        const values = [
{{range $Index, $Column := .NonKeyColumns}}
            model.{{$Column.Name}},
{{end}}
{{range $Index, $Column := .PrimaryKey}}
            model.{{$Column.Name}},
{{end}}
        ];
        await client.query(
            `UPDATE "{{.Name}}" SET
{{range $Index, $Column := .NonKeyColumns}}{{if $Index}},{{end}}
    "{{$Column.Name}}" = $${ {{$Index}} + 1 }
{{end}}
WHERE
{{- $NonKeyCount := len .NonKeyColumns -}}
{{range $Index, $Column := .PrimaryKey}}
    {{if $Index}}AND{{end}} "{{$Column.Name}}" = $${ {{$Index}} + {{$NonKeyCount}} + 1 }
{{end}}`,
            values);
    }

    static async upsert(client: PgClient, model: {{.Name}}$): Promise<void> {
        const exists = await this.find(client, model) !== null;
        if (exists) {
            await this.update(client, model);
        } else {
            await this.insert(client, model);
        }
    }

    static async delete(client: PgClient, pk: {{.Name}}Pk$): Promise<void> {
        const values = [
{{range $Index, $Column := .PrimaryKey}}
            pk.{{$Column.Name}},
{{end}}
        ];
        await client.query(
            `DELETE FROM "{{.Name}}"
WHERE
{{range $Index, $Column := .PrimaryKey}}
    {{if $Index}}AND{{end}} "{{$Column.Name}}" = $${ {{$Index}} + 1 }
{{end}}`,
            values);
    }

    static async find(client: PgClient, pk: {{.Name}}Pk$): Promise<{{.Name}}$ | null> {
        const values = [
{{range $Index, $Column := .PrimaryKey}}
            pk.{{$Column.Name}},
{{end}}
        ];
        const res = await client.query(
            `SELECT *
FROM "{{.Name}}"
WHERE
{{range $Index, $Column := .PrimaryKey}}
    {{if $Index}}AND{{end}} "{{$Column.Name}}" = $${ {{$Index}} + 1 }
{{end}}
LIMIT 1`,
            values);
        if (res.rows.length === 0) {
            return null;
        }
        return new {{.Name}}$(res.rows[0] as {{.Name}}Prop$);
    }

{{range .Index}}
    static async findOn{{.Name}}(client: PgClient, key: {{$TableName}}_{{.Name}}Key$): Promise<{{$TableName}}$[]> {
        const params: string[] = [];
        const stmt: string = `SELECT *
FROM "{{.Name}}"
WHERE `;
    {{range $Index, $Key := .Keys}}
        if (key.{{$Key.Name}} !== undefined) {
        params.push(key.{{$Key.Name}});
            if (params.length > 1) {
                stmt += " AND ";
            }
            stmt += `"{{$Key.Name}}" = $${values.length}`;
        }
    {{end}}
        const res = await client.query(stmt, params);
        return res.rows.map((row) => new {{$TableName}}$(row));
    }
{{end}}
}
{{- if .DataExists -}}
INSERT INTO "{{.TableName}}" ({{range $Index, $Column := .Columns}}{{if $Index}}, {{end}}"{{$Column.Name}}"{{end}}) VALUES
    {{- range $Index, $Record := .FieldLiterals}}{{if $Index}}, {{end}}
    ({{range $Index, $FieldLiteral := $Record}}{{if $Index}}, {{end}}{{$FieldLiteral}}{{end}})
    {{- end}}
ON CONFLICT ({{range $Index, $Key := .PrimaryKey}}{{if $Index}}, {{end}}"{{$Key}}"{{end}})
{{- if .NonPrimaryKey}} DO UPDATE SET
    {{- range $Index, $ColumnName := .NonPrimaryKey}}{{if $Index}}, {{end}}
    "{{$ColumnName}}" = EXCLUDED."{{$ColumnName}}"{{end}}
{{- else}}DO NOTHING{{end}}
;
{{- else -}}
-- No data found for {{.TableName}}.
{{- end}}

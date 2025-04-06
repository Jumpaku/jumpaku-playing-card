{{- $TableName := .TableName -}}
{{- $PrimaryKey := .PrimaryKey -}}
SELECT
    {{- range $Index, $Key := .PrimaryKey}}{{if $Index}},{{end}}
    "{{$TableName}}"."{{$Key}}"
    {{- end}}
FROM "{{.TableName}}"
{{- if .DataExists}}
    LEFT OUTER JOIN (
    {{range $Index, $Literals := .KeyValueLiterals}}    {{if $Index}}UNION {{else}}      {{end -}}
        SELECT {{range $Index, $Literal := $Literals}}{{if $Index}},{{end}}{{$Literal}} AS "{{index $PrimaryKey $Index}}"{{end}}
    {{end -}}
    ) AS csv ON
        {{range $Index, $Key := $PrimaryKey}}{{if $Index}} AND {{end}}"{{$TableName}}"."{{$Key}}" = "csv"."{{$Key}}"{{end}}
WHERE
    {{range $Index, $Key := $PrimaryKey}}{{if $Index}} OR {{end}}"csv"."{{$Key}}" IS NULL{{end}}
{{end -}}
